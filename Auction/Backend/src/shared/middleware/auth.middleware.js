import jwt from 'jsonwebtoken';
import { loadEnv } from '../../config/env.config.js';
import { AuthenticationError } from '../errors/authorization.error.js';

export function authenticate(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new AuthenticationError('Missing Bearer token');
    }
    const { jwtSecret } = loadEnv();
    const decoded = jwt.verify(token, jwtSecret);
    req.user = { id: decoded.sub, role: decoded.role, name: decoded.name, email: decoded.email };
    next();
  } catch (err) {
    if (err instanceof AuthenticationError) return next(err);
    next(new AuthenticationError('Invalid or expired token'));
  }
}
