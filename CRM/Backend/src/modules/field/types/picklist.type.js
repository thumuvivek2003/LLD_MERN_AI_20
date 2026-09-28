import { FieldTypeDescriptor } from './field-type.base.js';
import { FIELD_TYPE, INDEX_TYPE } from '../../../config/constants.js';

export class PicklistFieldType extends FieldTypeDescriptor {
  constructor(overrides = {}) {
    super({
      type: FIELD_TYPE.PICKLIST,
      label: 'Picklist',
      icon: 'list',
      indexType: INDEX_TYPE.HASH,
      supports: { unique: false, options: true, validation: [] },
      ...overrides,
    });
  }

  coerce(raw) {
    if (raw === null || raw === undefined || raw === '') return { ok: true, value: null };
    if (typeof raw === 'object') return { ok: false, message: 'Expected a single option value' };
    return { ok: true, value: String(raw).trim() };
  }
}
