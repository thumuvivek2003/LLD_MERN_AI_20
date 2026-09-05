// core/middleware/error.middleware.js — centralised error handler.
import { AppError } from '../errors/app.error.js';

export function handleError(err, _req, res, _next) {
  const status = err instanceof AppError ? err.statusCode : 500;
  if (status >= 500) console.error('[error]', err);
  res.status(status).json({
    error: err.name || 'Error',
    message: err.message || 'Something went wrong',
  });
}

export function notFoundRoute(_req, res) {
  res.status(404).json({ error: 'NotFound', message: 'Route not found' });
}
