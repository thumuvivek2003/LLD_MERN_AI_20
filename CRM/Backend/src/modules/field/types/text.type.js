import { FieldTypeDescriptor } from './field-type.base.js';
import { FIELD_TYPE, INDEX_TYPE } from '../../../config/constants.js';

export class TextFieldType extends FieldTypeDescriptor {
  constructor() {
    super({
      type: FIELD_TYPE.TEXT,
      label: 'Text',
      icon: 'type',
      indexType: INDEX_TYPE.TRIE,
      supports: { unique: true, validation: ['minLength', 'maxLength', 'regex'] },
    });
  }

  coerce(raw) {
    if (raw === null || raw === undefined) return { ok: true, value: null };
    if (typeof raw === 'object') return { ok: false, message: 'Expected a text value' };
    return { ok: true, value: String(raw).trim() };
  }
}
