import { BadRequestError } from '../errors/bad-request.error.js';

export const validateRequest = (validatorFn) => (req, _res, next) => {
  try {
    const errors = validatorFn(req.body || {});
    if (errors && errors.length) throw new BadRequestError(errors.join('; '));
    next();
  } catch (err) {
    next(err);
  }
};
