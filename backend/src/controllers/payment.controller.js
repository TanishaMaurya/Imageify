import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/ApiResponse.js';
import { paymentService } from '../services/payment.service.js';

export const paymentController = {
  packages: asyncHandler(async (req, res) => {
    const packages = paymentService.listPackages();
    sendResponse(res, 200, 'Packages fetched.', { packages });
  }),

  createOrder: asyncHandler(async (req, res) => {
    const order = await paymentService.createOrder(req.user.id, req.body.packageId);
    sendResponse(res, 201, 'Order created.', order);
  }),

  verify: asyncHandler(async (req, res) => {
    const result = await paymentService.verifyPayment(req.user.id, req.body);
    sendResponse(res, 200, 'Payment verified and credits added.', result);
  }),

  transactions: asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await paymentService.listTransactions(req.user.id, { page, limit });
    sendResponse(res, 200, 'Transactions fetched.', result);
  }),
};
