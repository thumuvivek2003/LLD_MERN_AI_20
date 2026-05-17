import { AppError } from '../errors/AppError.js';

export function notFoundHandler(req, res, _next) {
  return res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.originalUrl} not found` },
  });
}

export function globalErrorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      error: { code: err.code, message: err.message },
    });
  }
  console.error('[unhandled]', err);
  return res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: err.message || 'Internal server error' },
  });
}
