import { ApiError } from '../utils/ApiError.js';

/**
 * Validate req.body against a Zod schema.
 * On failure, returns a 400 with field-level details.
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const details = result.error.issues.map((i) => ({
      field: i.path.join('.'),
      message: i.message,
    }));
    return next(ApiError.badRequest('Validation failed', details));
  }
  req.body = result.data; // use the parsed/coerced data
  next();
};
