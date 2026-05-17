export const ERROR_CODES = Object.freeze({
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
});

export const HTTP_STATUS = Object.freeze({
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 400,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
});

/**
 * Domain error carrying a stable code + status. Thrown from services
 * and translated by the error middleware into the standard envelope.
 */
export class AppError extends Error {
  constructor(code, message, status) {
    super(message || code);
    this.code = code || ERROR_CODES.INTERNAL_ERROR;
    this.status = status || HTTP_STATUS[this.code] || 500;
  }
}
