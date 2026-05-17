import jwt from 'jsonwebtoken';
import { getAppConfig } from '../../config/app.config.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';

export function verifyAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new UnauthorizedError('Missing auth token');
    const { jwtSecret } = getAppConfig();
    const payload = jwt.verify(token, jwtSecret);
    req.user = { _id: payload._id, role: payload.role };
    next();
  } catch (err) {
    next(err instanceof UnauthorizedError ? err : new UnauthorizedError('Invalid token'));
  }
}

export function requireRole(role) {
  return (req, _res, next) => {
    if (!req.user) return next(new UnauthorizedError());
    if (req.user.role !== role) return next(new UnauthorizedError('Forbidden role'));
    next();
  };
}
