import { FieldTypeDescriptor } from './field-type.base.js';
import { FIELD_TYPE, INDEX_TYPE } from '../../../config/constants.js';

const TRUTHY = new Set(['true', '1', 'yes', 'y', 'on']);
const FALSY = new Set(['false', '0', 'no', 'n', 'off', '']);

export class BooleanFieldType extends FieldTypeDescriptor {
  constructor() {
    super({
      type: FIELD_TYPE.BOOLEAN,
      label: 'Checkbox',
      icon: 'toggle-left',
      indexType: INDEX_TYPE.HASH,
      supports: { unique: false, validation: [] },
    });
  }

  isEmpty(value) {
    return value === null || value === undefined;
  }

  coerce(raw) {
    if (raw === null || raw === undefined) return { ok: true, value: null };
    if (typeof raw === 'boolean') return { ok: true, value: raw };
    const s = String(raw).trim().toLowerCase();
    if (TRUTHY.has(s)) return { ok: true, value: true };
    if (FALSY.has(s)) return { ok: true, value: false };
    return { ok: false, message: 'Expected true or false' };
  }
}
