import { ValidationError } from '../errors/ValidationError.js';

/**
 * Minimal ad-hoc validator. schema is a function (body) => string|null returning error message.
 */
export function validateRequest(schema) {
  return (req, _res, next) => {
    try {
      const error = schema(req.body || {}, req);
      if (error) throw new ValidationError(error);
      next();
    } catch (e) {
      next(e);
    }
  };
}

export function requireFields(fields = []) {
  return (req, _res, next) => {
    const missing = fields.filter((f) => req.body?.[f] === undefined || req.body?.[f] === null || req.body?.[f] === '');
    if (missing.length) return next(new ValidationError(`Missing required fields: ${missing.join(', ')}`));
    next();
  };
}

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
