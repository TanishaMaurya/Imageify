/**
 * Wraps an async route handler so thrown/rejected errors
 * are forwarded to Express's error-handling middleware.
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
