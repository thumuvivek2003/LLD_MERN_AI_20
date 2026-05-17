import { AppError } from './AppError.js';

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    super(message, { code, status: 401 });
    this.name = 'UnauthorizedError';
  }
}
