import { AppException } from './app.exception.js';

export class ValidationException extends AppException {
  constructor(message, details = null) {
    super('VALIDATION_ERROR', message, 400, details);
    this.name = 'ValidationException';
  }
}
