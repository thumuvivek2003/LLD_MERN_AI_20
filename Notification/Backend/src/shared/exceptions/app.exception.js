export class AppException extends Error {
  constructor(code, message, status = 400, details = null) {
    super(message);
    this.name = 'AppException';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}
