import { AppError } from '../errors/app.error.js';
import { createLogger } from '../../config/logger.config.js';

const logger = createLogger();

export const globalErrorHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }
  logger.error(err);
  return res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
};
