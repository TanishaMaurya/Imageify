import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';

export const historyService = {
  /**
   * Paginated + searchable image history for a user.
   * @param {object} opts { page, limit, search, favoritesOnly }
   */
  async list(userId, { page = 1, limit = 12, search = '', favoritesOnly = false }) {
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(search && { prompt: { contains: search, mode: 'insensitive' } }),
      ...(favoritesOnly && { isFavorite: true }),
    };

    const [items, total] = await Promise.all([
      prisma.image.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.image.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  },

  async toggleFavorite(userId, imageId) {
    const image = await prisma.image.findUnique({ where: { id: imageId } });
    if (!image || image.userId !== userId) {
      throw ApiError.notFound('Image not found.');
    }
    return prisma.image.update({
      where: { id: imageId },
      data: { isFavorite: !image.isFavorite },
    });
  },

  async remove(userId, imageId) {
    const image = await prisma.image.findUnique({ where: { id: imageId } });
    if (!image || image.userId !== userId) {
      throw ApiError.notFound('Image not found.');
    }
    await prisma.image.delete({ where: { id: imageId } });
    return { message: 'Image deleted.' };
  },
};
