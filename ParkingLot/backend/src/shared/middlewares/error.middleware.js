import { AppError } from '../exceptions/app-error.js';

export const errorMiddleware = (err, req, res, _next) => {
  const status = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';
  if (status >= 500) console.error(err);
  res.status(status).json({ success: false, error: message });
};
