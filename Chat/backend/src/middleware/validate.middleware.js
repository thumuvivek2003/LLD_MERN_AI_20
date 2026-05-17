import { validationResult } from 'express-validator';
import { AppError, ERROR_CODES } from '../shared/constants/errors.constant.js';

/**
 * Runs an array of express-validator chains then collects errors.
 * Usage: router.post('/x', validate([body('foo').isString()]), handler)
 */
export function validate(chains = []) {
  return async (req, _res, next) => {
    for (const chain of chains) {
      await chain.run(req);
    }
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const message = result
        .array()
        .map((e) => `${e.path}: ${e.msg}`)
        .join('; ');
      return next(new AppError(ERROR_CODES.VALIDATION_ERROR, message));
    }
    return next();
  };
}
