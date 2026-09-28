import { AppError } from './app.error.js';
import { ERROR_CODE } from '../../config/constants.js';

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', details = null) {
    super(message, 400, ERROR_CODE.BAD_REQUEST, details);
  }
}
