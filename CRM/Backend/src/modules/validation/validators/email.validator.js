import { IValidator } from '../../../core/interfaces/validator.interface.js';
import { FIELD_TYPE } from '../../../config/constants.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

export class EmailValidator extends IValidator {
  get rule() {
    return 'EMAIL_FORMAT';
  }

  appliesTo(field) {
    return field.type === FIELD_TYPE.EMAIL;
  }

  async validate({ field, value }) {
    if (value === null || value === undefined || value === '') return null;
    if (EMAIL_RE.test(String(value))) return null;
    return this.error(field, field.validation?.message || 'Invalid email');
  }
}
