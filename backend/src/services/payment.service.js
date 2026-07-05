import crypto from 'crypto';
import Razorpay from 'razorpay';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { CREDIT_PACKAGES, getPackageById } from '../config/constants.js';

// Lazily create the Razorpay client so the server can still boot in
// environments where payment keys aren't configured (e.g. running
// only auth/image features locally).
let razorpay = null;
const getClient = () => {
  if (!env.razorpay.keyId || !env.razorpay.keySecret) {
    throw ApiError.internal('Payments are not configured (missing Razorpay keys).');
  }
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: env.razorpay.keyId,
      key_secret: env.razorpay.keySecret,
    });
  }
  return razorpay;
};

export const paymentService = {
  listPackages() {
    return CREDIT_PACKAGES;
  },

  /**
   * Create a Razorpay order for a credit package and store a PENDING
   * transaction. Returns the order + the public key the frontend needs.
   */
  async createOrder(userId, packageId) {
    const pack = getPackageById(packageId);
    if (!pack) throw ApiError.badRequest('Invalid credit package.');

    const client = getClient();
    const amountPaise = pack.amount * 100; // Razorpay expects paise

    const order = await client.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: { userId, packageId, credits: String(pack.credits) },
    });

    await prisma.transaction.create({
      data: {
        userId,
        orderId: order.id,
        amount: pack.amount,
        creditsAdded: pack.credits,
        status: 'PENDING',
      },
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: env.razorpay.keyId,
      credits: pack.credits,
      packageLabel: pack.label,
    };
  },

  /**
   * Verify the Razorpay signature. On success, mark the transaction
   * SUCCESS and credit the user's account — all atomically.
   */
  async verifyPayment(userId, { razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    // 1. Recompute the expected signature: HMAC-SHA256(order_id|payment_id).
    const expected = crypto
      .createHmac('sha256', env.razorpay.keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const valid =
      expected.length === razorpay_signature.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature));

    // 2. Look up the pending transaction we created at order time.
    const txn = await prisma.transaction.findUnique({
      where: { orderId: razorpay_order_id },
    });
    if (!txn || txn.userId !== userId) {
      throw ApiError.notFound('Transaction not found.');
    }
    if (txn.status === 'SUCCESS') {
      // Idempotent: already processed (e.g. duplicate verify call).
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { credits: true },
      });
      return { transaction: txn, credits: user.credits };
    }

    if (!valid) {
      await prisma.transaction.update({
        where: { orderId: razorpay_order_id },
        data: { status: 'FAILED', paymentId: razorpay_payment_id },
      });
      throw ApiError.badRequest('Payment signature verification failed.');
    }

    // 3. Signature valid -> credit the user and mark success atomically.
    const [updatedTxn, updatedUser] = await prisma.$transaction([
      prisma.transaction.update({
        where: { orderId: razorpay_order_id },
        data: { status: 'SUCCESS', paymentId: razorpay_payment_id },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: txn.creditsAdded } },
        select: { credits: true },
      }),
    ]);

    return { transaction: updatedTxn, credits: updatedUser.credits };
  },

  async listTransactions(userId, { page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where: { userId } }),
    ]);

    return {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  },
};
