import { ERROR_CODE } from '../../config/constants.js';

/**
 * Base of the typed-error hierarchy. The error middleware maps
 * `code` + `statusCode` straight onto CONTRACT.md §1's failure envelope,
 * so no controller ever formats an error by hand.
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, code = ERROR_CODE.INTERNAL_ERROR, details = null) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace?.(this, new.target);
  }

  toEnvelope() {
    const error = { code: this.code, message: this.message };
    if (this.details) error.details = this.details;
    return { success: false, error };
  }
}
