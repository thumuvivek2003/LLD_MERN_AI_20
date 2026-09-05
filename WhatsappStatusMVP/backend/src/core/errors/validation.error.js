// core/errors/validation.error.js
import { AppError } from './app.error.js';

export class ValidationError extends AppError {
  constructor(message = 'Invalid request') {
    super(message, 400);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Not allowed') {
    super(message, 403);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Not authenticated') {
    super(message, 401);
  }
}
