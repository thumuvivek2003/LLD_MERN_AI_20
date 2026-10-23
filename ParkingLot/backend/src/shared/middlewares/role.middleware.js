import { AppError } from '../exceptions/app-error.js';

export const requireRole = (...allowed) => (req, _res, next) => {
  if (!req.user) return next(new AppError('Unauthorized', 401));
  if (!allowed.includes(req.user.role)) return next(new AppError('Forbidden', 403));
  next();
};
