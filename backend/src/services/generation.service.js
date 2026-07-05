import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { imageService } from './image.service.js';

export const generationService = {
  /**
   * Full generation flow:
   *  1. Ensure the user has at least 1 credit.
   *  2. Call the provider to generate the image.
   *  3. Persist the image + atomically deduct 1 credit in a transaction.
   *
   * We generate FIRST and only deduct the credit after success, so users
   * are never charged for a failed generation.
   */
  async generate(userId, { prompt, style, aspectRatio }) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });
    if (!user) throw ApiError.notFound('User not found.');
    if (user.credits < 1) {
      throw ApiError.payment('You have no credits left. Please buy more to continue.');
    }

    // Generate (may throw). No credit deducted if this fails.
    const imageUrl = await imageService.generate({ prompt, style, aspectRatio });

    // Persist image + deduct credit atomically. We use a conditional
    // updateMany on credits to guard against a race that could push
    // credits below zero.
    const [image] = await prisma.$transaction(async (tx) => {
      const decremented = await tx.user.updateMany({
        where: { id: userId, credits: { gte: 1 } },
        data: { credits: { decrement: 1 } },
      });
      if (decremented.count === 0) {
        throw ApiError.payment('You have no credits left.');
      }

      const created = await tx.image.create({
        data: { userId, prompt, imageUrl, style, aspectRatio },
      });

      const updatedUser = await tx.user.findUnique({
        where: { id: userId },
        select: { credits: true },
      });

      return [created, updatedUser];
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    return { image, credits: updatedUser.credits };
  },
};
