import { IValidator } from '../../../core/interfaces/validator.interface.js';
import { FIELD_TYPE } from '../../../config/constants.js';

const DATEY = new Set([FIELD_TYPE.DATE, FIELD_TYPE.DATETIME]);

/**
 * Coercion already rejects unparseable dates; this strategy owns the
 * *business* date rules — min/max windows expressed as epoch days or ISO strings.
 */
export class DateValidator extends IValidator {
  get rule() {
    return 'DATE_FORMAT';
  }

  appliesTo(field) {
    return DATEY.has(field.type);
  }

  async validate({ field, value }) {
    if (value === null || value === undefined || value === '') return null;
    const time = new Date(value).getTime();
    if (Number.isNaN(time)) return this.error(field, `${field.label} is not a valid date`);

    const { min, max, message } = field.validation || {};
    if (min !== null && min !== undefined) {
      const minTime = new Date(min).getTime();
      if (!Number.isNaN(minTime) && time < minTime) {
        return this.error(field, message || `${field.label} must be on or after ${String(min).slice(0, 10)}`);
      }
    }
    if (max !== null && max !== undefined) {
      const maxTime = new Date(max).getTime();
      if (!Number.isNaN(maxTime) && time > maxTime) {
        return this.error(field, message || `${field.label} must be on or before ${String(max).slice(0, 10)}`);
      }
    }
    return null;
  }
}
