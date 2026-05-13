import { AppError } from "./AppError.js";

export class AuthenticationError extends AppError {
  constructor(message = "Authentication failed", code = "AUTH_FAILED", details = null) {
    super(message, 401, code, details);
  }
}
