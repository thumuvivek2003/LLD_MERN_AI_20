/**
 * Application-level error carrying an HTTP status and a machine-readable code.
 * Thrown by services/controllers; translated to the response envelope by
 * the central error middleware.
 */
export class AppError extends Error {
  /**
   * @param {number} statusCode
   * @param {string} message
   * @param {string} [code='ERROR']
   */
  constructor(statusCode, message, code = 'ERROR') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace?.(this, AppError);
  }

  static badRequest(message, code = 'BAD_REQUEST') {
    return new AppError(400, message, code);
  }

  static notFound(message = 'Resource not found', code = 'NOT_FOUND') {
    return new AppError(404, message, code);
  }
}
