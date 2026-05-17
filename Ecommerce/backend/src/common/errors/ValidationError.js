import { AppError } from './AppError.js';

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', code = 'VALIDATION_ERROR') {
    super(message, { code, status: 400 });
    this.name = 'ValidationError';
  }
}
