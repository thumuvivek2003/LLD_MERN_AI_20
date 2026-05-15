export class AppError extends Error {
  constructor(code = "APP_ERROR", statusCode = 500, message = "Something went wrong", details = null) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
  }
}
