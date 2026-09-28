import { FieldTypeDescriptor, EMPTY_KEY } from './field-type.base.js';
import { FIELD_TYPE, INDEX_TYPE } from '../../../config/constants.js';

/** Stored as an ISO `YYYY-MM-DD` string so index keys sort lexicographically = chronologically. */
export class DateFieldType extends FieldTypeDescriptor {
  constructor(overrides = {}) {
    super({
      type: FIELD_TYPE.DATE,
      label: 'Date',
      icon: 'calendar',
      indexType: INDEX_TYPE.BTREE,
      supports: { unique: false, validation: ['min', 'max'] },
      ...overrides,
    });
  }

  coerce(raw) {
    if (raw === null || raw === undefined || raw === '') return { ok: true, value: null };
    const d = raw instanceof Date ? raw : new Date(raw);
    if (Number.isNaN(d.getTime())) return { ok: false, message: 'Expected a valid date' };
    return { ok: true, value: d.toISOString().slice(0, 10) };
  }

  indexKeys(value) {
    return this.isEmpty(value) ? [EMPTY_KEY] : [String(value)];
  }

  sortValue(value) {
    return this.isEmpty(value) ? '' : String(value);
  }
}
