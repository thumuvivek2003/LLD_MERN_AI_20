import { AppError } from './app.error.js';
import { ERROR_CODE } from '../../config/constants.js';

export class NotFoundError extends AppError {
  constructor(what = 'Resource', id = '') {
    super(id ? `${what} '${id}' not found` : `${what} not found`, 404, ERROR_CODE.NOT_FOUND);
  }
}
