import { ValidationError } from '../../../common/errors/ValidationError.js';

/**
 * Each concrete state overrides only its legal transitions and returns the next status string.
 * Default impl rejects — keeps state machine strict.
 */
export class IOrderState {
  // eslint-disable-next-line no-unused-vars
  confirm(_order) {
    throw new ValidationError('Illegal transition: confirm', 'INVALID_TRANSITION');
  }
  // eslint-disable-next-line no-unused-vars
  ship(_order) {
    throw new ValidationError('Illegal transition: ship', 'INVALID_TRANSITION');
  }
  // eslint-disable-next-line no-unused-vars
  deliver(_order) {
    throw new ValidationError('Illegal transition: deliver', 'INVALID_TRANSITION');
  }
  // eslint-disable-next-line no-unused-vars
  cancel(_order) {
    throw new ValidationError('Illegal transition: cancel', 'INVALID_TRANSITION');
  }
}
