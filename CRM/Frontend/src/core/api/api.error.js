/**
 * Normalised transport error. Every api service rejects with this shape so pages
 * and forms can branch on `code` and map `details` back onto inputs by `fieldId`.
 */
export class ApiError extends Error {
  constructor({ code, message, details = [], status = 0 }) {
    super(message || 'Something went wrong');
    this.name = 'ApiError';
    this.code = code || 'INTERNAL_ERROR';
    this.details = details;
    this.status = status;
  }

  static fromEnvelope(body, status) {
    const error = body?.error || {};
    return new ApiError({
      code: error.code,
      message: error.message,
      details: error.details || [],
      status,
    });
  }

  get isValidation() {
    return this.code === 'VALIDATION_ERROR';
  }

  get isPermission() {
    return this.code === 'PERMISSION_DENIED';
  }

  get isNotFound() {
    return this.code === 'NOT_FOUND';
  }

  get isConflict() {
    return this.code === 'CONFLICT';
  }

  /** `{ [fieldId]: message }` — consumed by DynamicForm to paint server errors on inputs. */
  toFieldErrors() {
    return this.details.reduce((acc, detail) => {
      if (detail?.fieldId) acc[detail.fieldId] = detail.message;
      return acc;
    }, {});
  }
}

export default ApiError;
