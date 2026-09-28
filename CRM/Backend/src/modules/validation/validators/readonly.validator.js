import { IValidator } from '../../../core/interfaces/validator.interface.js';

/**
 * Rejects writes to a read-only field. Only fires when the client actually
 * sent the key (`touched`), so untouched read-only values pass through updates.
 */
export class ReadOnlyValidator extends IValidator {
  get rule() {
    return 'READ_ONLY';
  }

  appliesTo(field) {
    return field.readOnly === true;
  }

  async validate({ field, isCreate, touched }) {
    if (isCreate) return null;
    if (!touched?.has(field.fieldId)) return null;
    return this.error(field, `${field.label} is read-only and cannot be changed`);
  }
}
