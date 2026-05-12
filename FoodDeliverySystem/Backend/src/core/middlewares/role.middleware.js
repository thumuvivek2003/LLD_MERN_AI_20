import { ForbiddenError } from '../errors/unauthorized.error.js';

export const authorizeRoles = (...allowed) => (req, _res, next) => {
  if (!req.user || !allowed.includes(req.user.role)) {
    return next(new ForbiddenError('You do not have permission to perform this action'));
  }
  next();
};
