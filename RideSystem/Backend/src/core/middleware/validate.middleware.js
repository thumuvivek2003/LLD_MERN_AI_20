import { AppError } from '../exceptions/app.error.js';

export const validate = (validator) => (req, _res, next) => {
  try {
    const errors = validator(req.body);
    if (errors && errors.length) {
      return next(new AppError(`Validation failed: ${errors.join(', ')}`, 400, 'VALIDATION'));
    }
    next();
  } catch (e) {
    next(e);
  }
};
