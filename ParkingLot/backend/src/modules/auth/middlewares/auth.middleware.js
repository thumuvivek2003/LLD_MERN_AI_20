import { CONSTANTS } from '../../../config/constants.js';
import { AppError } from '../../../shared/exceptions/app-error.js';
import { decodeToken } from '../services/auth.service.js';

export const authenticate = (req, _res, next) => {
  const header = req.headers[CONSTANTS.TOKEN_HEADER];
  if (!header || !header.startsWith(CONSTANTS.TOKEN_PREFIX)) {
    return next(new AppError('Missing token', 401));
  }
  const token = header.slice(CONSTANTS.TOKEN_PREFIX.length);
  const payload = decodeToken(token);
  if (!payload) return next(new AppError('Invalid token', 401));
  req.user = payload;
  next();
};
