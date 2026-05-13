import { AppError } from '../exceptions/app.error.js';
import { logger } from '../utils/logger.util.js';

export function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: `Not found: ${req.originalUrl}`, code: 'NOT_FOUND' });
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, message: err.message, code: err.code });
  }
  logger.error('Unhandled error', err);
  res.status(500).json({ success: false, message: err.message || 'Internal server error', code: 'INTERNAL' });
}
