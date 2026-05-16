import { ValidationException } from '../../../shared/exceptions/validation.exception.js';

export function buildRetryDto(params) {
  if (!params || !params.id) {
    throw new ValidationException('Notification id is required');
  }
  return { id: params.id };
}
