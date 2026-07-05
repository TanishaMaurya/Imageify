import { ApiError } from '../utils/ApiError.js';

/**
 * Restrict a route to specific roles (e.g. ADMIN).
 * Must run after `protect`.
 */
export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission to perform this action.'));
    }
    next();
  };
