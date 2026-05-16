import { AppException } from '../exceptions/app.exception.js';
import { logger } from '../logger/logger.js';
import { fail } from '../utils/response.util.js';

export function notFoundHandler(req, res) {
  return fail(res, 404, 'ROUTE_NOT_FOUND', `No route for ${req.method} ${req.originalUrl}`);
}

export function handleError(err, _req, res, _next) {
  if (err instanceof AppException) {
    logger.warn('app.exception', { code: err.code, message: err.message, details: err.details });
    return fail(res, err.status, err.code, err.message);
  }
  logger.error('unhandled.exception', { message: err.message, stack: err.stack });
  return fail(res, 500, 'INTERNAL_ERROR', err.message || 'Something went wrong');
}
