import { AppError } from '../utils/app-error.util.js';

/**
 * Central Express error handler. Must be registered LAST (4-arg signature).
 * Emits the standard failure envelope.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let message = 'Internal server error';
  let code = 'INTERNAL_ERROR';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
  } else if (err?.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
    code = 'VALIDATION_ERROR';
  } else if (err?.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    code = 'INVALID_ID';
  } else if (err?.message) {
    message = err.message;
  }

  if (statusCode >= 500) {
    // Log unexpected errors for debugging.
    console.error('[error]', err);
  }

  res.status(statusCode).json({
    success: false,
    error: { message, code },
  });
}
