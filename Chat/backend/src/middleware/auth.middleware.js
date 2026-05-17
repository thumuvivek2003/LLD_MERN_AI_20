import { verifyAccessToken } from '../shared/utils/jwt.util.js';
import { AppError, ERROR_CODES } from '../shared/constants/errors.constant.js';

/**
 * Verifies "Authorization: Bearer <jwt>" and populates req.user.
 */
export function authenticate(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      throw new AppError(ERROR_CODES.UNAUTHORIZED, 'Missing or malformed Authorization header');
    }
    const token = header.slice('Bearer '.length).trim();
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role, mobile: payload.mobile };
    return next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    return next(new AppError(ERROR_CODES.UNAUTHORIZED, 'Invalid or expired token'));
  }
}
