import { ZodError } from 'zod';
import { AppError } from '../errors/app.error.js';
import { errorResponse } from '../utils/response.util.js';
import { logError } from '../utils/logger.util.js';

export function globalErrorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    const message = err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    return errorResponse(res, message, 400, 'VALIDATION_FAILED');
  }
  if (err instanceof AppError) {
    return errorResponse(res, err.message, err.status, err.code);
  }
  logError('Unhandled error', err);
  return errorResponse(res, err.message || 'Internal Server Error', 500);
}

export function notFoundHandler(_req, res) {
  return errorResponse(res, 'Route not found', 404, 'NOT_FOUND');
}
