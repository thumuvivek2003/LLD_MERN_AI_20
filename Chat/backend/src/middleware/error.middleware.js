import { errorResponse } from '../shared/utils/response.util.js';
import { AppError, ERROR_CODES, HTTP_STATUS } from '../shared/constants/errors.constant.js';
import { logger } from '../shared/logger/logger.js';

/**
 * Final express error handler. Translates AppError or unknown errors
 * into the standard error envelope.
 */
// eslint-disable-next-line no-unused-vars
export function handleError(err, _req, res, _next) {
  if (err instanceof AppError) {
    return errorResponse(res, err.code, err.message, err.status);
  }
  logger.error('Unhandled error:', err?.stack || err?.message || err);
  return errorResponse(
    res,
    ERROR_CODES.INTERNAL_ERROR,
    err?.message || 'Internal server error',
    HTTP_STATUS.INTERNAL_ERROR
  );
}
