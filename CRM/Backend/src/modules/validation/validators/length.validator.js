import { IValidator } from '../../../core/interfaces/validator.interface.js';
import { FIELD_TYPE } from '../../../config/constants.js';

const TEXTUAL = new Set([FIELD_TYPE.TEXT, FIELD_TYPE.TEXTAREA, FIELD_TYPE.EMAIL, FIELD_TYPE.PHONE, FIELD_TYPE.URL]);

export class LengthValidator extends IValidator {
  get rule() {
    return 'LENGTH';
  }

  appliesTo(field) {
    return (
      TEXTUAL.has(field.type) &&
      (field.validation?.minLength !== null || field.validation?.maxLength !== null)
    );
  }

  async validate({ field, value }) {
    if (value === null || value === undefined || value === '') return null;
    const len = String(value).length;
    const { minLength, maxLength, message } = field.validation;
    if (minLength !== null && minLength !== undefined && len < Number(minLength)) {
      return this.error(field, message || `${field.label} must be at least ${minLength} characters`);
    }
    if (maxLength !== null && maxLength !== undefined && len > Number(maxLength)) {
      return this.error(field, message || `${field.label} must be at most ${maxLength} characters`);
    }
    return null;
  }
}
