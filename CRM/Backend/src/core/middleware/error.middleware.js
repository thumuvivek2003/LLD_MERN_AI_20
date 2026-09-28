import mongoose from 'mongoose';
import { AppError } from '../exceptions/app.error.js';
import { ERROR_CODE } from '../../config/constants.js';
import { logger } from '../utils/logger.util.js';

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: { code: ERROR_CODE.NOT_FOUND, message: `No route for ${req.method} ${req.originalUrl}` },
  });
}

/** The single place where an exception becomes a CONTRACT.md §1 failure envelope. */
export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(err.toEnvelope());
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map((e) => ({
      fieldId: e.path,
      apiName: e.path,
      rule: 'SCHEMA',
      message: e.message,
    }));
    return res
      .status(422)
      .json({ success: false, error: { code: ERROR_CODE.VALIDATION_ERROR, message: 'Schema validation failed', details } });
  }

  if (err?.code === 11000) {
    return res
      .status(409)
      .json({ success: false, error: { code: ERROR_CODE.CONFLICT, message: 'Duplicate key', details: err.keyValue } });
  }

  if (err instanceof SyntaxError && 'body' in err) {
    return res
      .status(400)
      .json({ success: false, error: { code: ERROR_CODE.BAD_REQUEST, message: 'Malformed JSON body' } });
  }

  logger.error(`Unhandled: ${err.message}`, err.stack, 'error-middleware');
  res.status(500).json({
    success: false,
    error: { code: ERROR_CODE.INTERNAL_ERROR, message: err.message || 'Internal server error' },
  });
}
