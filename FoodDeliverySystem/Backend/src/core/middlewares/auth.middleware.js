import { verifyAccessToken } from '../utils/jwt.util.js';
import { UnauthorizedError } from '../errors/unauthorized.error.js';

export const authenticateUser = (req, _res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new UnauthorizedError('Missing access token');
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.sub, role: decoded.role, email: decoded.email };
    next();
  } catch (err) {
    next(err);
  }
};
