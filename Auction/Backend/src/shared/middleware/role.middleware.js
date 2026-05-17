import { AuthorizationError } from '../errors/authorization.error.js';

export function authorizeRoles(...allowed) {
  return (req, _res, next) => {
    if (!req.user) return next(new AuthorizationError('No user on request'));
    if (!allowed.includes(req.user.role)) {
      return next(new AuthorizationError(`Role ${req.user.role} not permitted`));
    }
    next();
  };
}
