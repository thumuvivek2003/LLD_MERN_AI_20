import { AppError } from './app.error.js';
import { ERROR_CODE } from '../../config/constants.js';

/** Carries the structured `details[]` array produced by the validation engine. */
export class ValidationError extends AppError {
  constructor(details = []) {
    const n = details.length;
    super(`${n} field${n === 1 ? '' : 's'} failed validation`, 422, ERROR_CODE.VALIDATION_ERROR, details);
  }
}
