import { IValidator } from '../../../core/interfaces/validator.interface.js';
import { FIELD_TYPE } from '../../../config/constants.js';

export class PicklistValidator extends IValidator {
  get rule() {
    return 'PICKLIST';
  }

  appliesTo(field) {
    return (
      (field.type === FIELD_TYPE.PICKLIST || field.type === FIELD_TYPE.MULTI_PICKLIST) &&
      Array.isArray(field.options) &&
      field.options.length > 0
    );
  }

  async validate({ field, value }) {
    if (value === null || value === undefined || value === '') return null;
    const allowed = new Set(field.options.map((o) => o.value));
    const values = Array.isArray(value) ? value : [value];
    const bad = values.filter((v) => !allowed.has(String(v)));
    if (!bad.length) return null;
    return this.error(
      field,
      field.validation?.message || `${field.label}: '${bad.join(', ')}' is not an allowed option`,
    );
  }
}
