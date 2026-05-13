import { verifyToken } from '../utils/jwt.util.js';
import { AuthError } from '../exceptions/auth.error.js';

export function authMiddleware(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new AuthError('Missing auth token'));
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new AuthError('Invalid or expired token'));
  }
}
