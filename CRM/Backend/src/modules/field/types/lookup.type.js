import { FieldTypeDescriptor } from './field-type.base.js';
import { FIELD_TYPE, INDEX_TYPE } from '../../../config/constants.js';

/** Stores the referenced recordId — the metadata-driven equivalent of a foreign key. */
export class LookupFieldType extends FieldTypeDescriptor {
  constructor() {
    super({
      type: FIELD_TYPE.LOOKUP,
      label: 'Lookup Relationship',
      icon: 'link-2',
      indexType: INDEX_TYPE.HASH,
      supports: { unique: false, lookup: true, defaultValue: false, validation: [] },
    });
  }

  coerce(raw) {
    if (raw === null || raw === undefined || raw === '') return { ok: true, value: null };
    if (typeof raw === 'object') return { ok: false, message: 'Expected a related record id' };
    return { ok: true, value: String(raw).trim() };
  }
}
