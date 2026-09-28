import { AppError } from './app.error.js';
import { ERROR_CODE } from '../../config/constants.js';

export class ConflictError extends AppError {
  constructor(message = 'Conflicting state', details = null) {
    super(message, 409, ERROR_CODE.CONFLICT, details);
  }
}
