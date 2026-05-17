import { authService } from '../../auth/auth.service.js';
import { UnauthorizedError } from '../../../shared/exceptions/UnauthorizedError.js';
import { AppError } from '../../../shared/exceptions/AppError.js';

export function authenticate(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new UnauthorizedError('Missing Authorization header');
    req.user = authService.verifyToken(token);
    next();
  } catch (err) {
    next(err);
  }
}

export function validateAdminAccess(req, _res, next) {
  if (!req.user) return next(new UnauthorizedError('Not authenticated'));
  if (req.user.role !== 'admin') return next(new AppError('Admin access required', 403, 'FORBIDDEN'));
  next();
}

export const requireAdmin = validateAdminAccess;
