import { ForbiddenError } from '../exceptions/auth.error.js';

export const requireRole = (...allowed) => (req, _res, next) => {
  if (!req.user || !allowed.includes(req.user.role)) {
    return next(new ForbiddenError(`Requires role: ${allowed.join(', ')}`));
  }
  next();
};
