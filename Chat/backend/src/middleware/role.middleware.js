import { AppError, ERROR_CODES } from '../shared/constants/errors.constant.js';

/**
 * authorize('ADMIN') or authorize('ADMIN','USER') for role-gated routes.
 */
export function authorize(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) return next(new AppError(ERROR_CODES.UNAUTHORIZED, 'Authentication required'));
    if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
      return next(new AppError(ERROR_CODES.FORBIDDEN, 'Insufficient role'));
    }
    return next();
  };
}
