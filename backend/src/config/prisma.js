import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

/**
 * Prisma client singleton.
 * In development, reuse the instance across hot-reloads to avoid
 * exhausting the database connection pool.
 */
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: env.isProd ? ['error'] : ['error', 'warn'],
  });

if (!env.isProd) {
  globalForPrisma.prisma = prisma;
}
