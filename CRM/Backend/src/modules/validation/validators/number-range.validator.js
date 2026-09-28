import { IValidator } from '../../../core/interfaces/validator.interface.js';
import { FIELD_TYPE } from '../../../config/constants.js';

const NUMERIC = new Set([FIELD_TYPE.NUMBER, FIELD_TYPE.CURRENCY]);

export class NumberRangeValidator extends IValidator {
  get rule() {
    return 'NUMBER_RANGE';
  }

  appliesTo(field) {
    return NUMERIC.has(field.type) && (field.validation?.min !== null || field.validation?.max !== null);
  }

  async validate({ field, value }) {
    if (value === null || value === undefined || value === '') return null;
    const n = Number(value);
    const { min, max, message } = field.validation;
    if (min !== null && min !== undefined && n < Number(min)) {
      return this.error(field, message || `${field.label} must be at least ${min}`);
    }
    if (max !== null && max !== undefined && n > Number(max)) {
      return this.error(field, message || `${field.label} must be at most ${max}`);
    }
    return null;
  }
}
