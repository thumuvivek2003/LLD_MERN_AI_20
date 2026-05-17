export class AppError extends Error {
  constructor(message, { code = 'APP_ERROR', status = 500 } = {}) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
  }
}
