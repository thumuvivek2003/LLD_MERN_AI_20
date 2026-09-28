import { FieldTypeDescriptor, EMPTY_KEY } from './field-type.base.js';
import { FIELD_TYPE, INDEX_TYPE } from '../../../config/constants.js';

export class NumberFieldType extends FieldTypeDescriptor {
  constructor(overrides = {}) {
    super({
      type: FIELD_TYPE.NUMBER,
      label: 'Number',
      icon: 'hash',
      indexType: INDEX_TYPE.BTREE,
      supports: { unique: true, validation: ['min', 'max'] },
      ...overrides,
    });
  }

  coerce(raw) {
    if (raw === null || raw === undefined || raw === '') return { ok: true, value: null };
    const n = typeof raw === 'number' ? raw : Number(String(raw).replace(/[,\s]/g, ''));
    if (Number.isNaN(n)) return { ok: false, message: 'Expected a numeric value' };
    return { ok: true, value: n };
  }

  indexKeys(value) {
    return this.isEmpty(value) ? [EMPTY_KEY] : [String(value)];
  }

  sortValue(value) {
    return this.isEmpty(value) ? Number.NEGATIVE_INFINITY : Number(value);
  }
}
