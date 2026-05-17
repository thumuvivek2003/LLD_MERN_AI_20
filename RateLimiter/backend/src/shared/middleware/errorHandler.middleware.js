import { AppError } from '../exceptions/AppError.js';

export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: { message: err.message, code: err.code } });
  }
  const message = err?.message || 'Internal server error';
  return res.status(500).json({ error: { message, code: 'INTERNAL_ERROR' } });
}

export function notFoundHandler(req, res) {
  return res.status(404).json({
    error: { message: `No route for ${req.method} ${req.originalUrl}`, code: 'NOT_FOUND' },
  });
}
