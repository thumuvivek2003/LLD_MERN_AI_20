import { AppError } from './app.error.js';
import { ERROR_CODE } from '../../config/constants.js';

export class PermissionError extends AppError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, 403, ERROR_CODE.PERMISSION_DENIED);
  }
}
