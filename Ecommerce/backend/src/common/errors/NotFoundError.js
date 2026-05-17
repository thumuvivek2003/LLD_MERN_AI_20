import { AppError } from './AppError.js';

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', code = 'NOT_FOUND') {
    super(message, { code, status: 404 });
    this.name = 'NotFoundError';
  }
}
