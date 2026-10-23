import { error } from '../utils/responses.js';

export const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Authentication required', 401);
    }

    if (!roles.includes(req.user.role)) {
      return error(res, 'Access denied. Insufficient permissions', 403);
    }

    next();
  };
};