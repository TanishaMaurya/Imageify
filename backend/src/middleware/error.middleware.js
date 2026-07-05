import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

/**
 * Global error handler. Must be registered last.
 * Normalizes all errors into a consistent JSON shape.
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Prisma known errors -> friendly messages
  if (err?.code === 'P2002') {
    error = ApiError.conflict(
      `A record with this ${err.meta?.target?.join(', ') || 'value'} already exists.`
    );
  } else if (err?.code === 'P2025') {
    error = ApiError.notFound('Record not found.');
  }

  if (!(error instanceof ApiError)) {
    error = ApiError.internal(err.message || 'Something went wrong.');
  }

  if (!env.isProd) {
    // eslint-disable-next-line no-console
    console.error('❌', err);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(error.details ? { errors: error.details } : {}),
    ...(env.isProd ? {} : { stack: err.stack }),
  });
};
