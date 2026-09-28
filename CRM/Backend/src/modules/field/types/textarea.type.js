import { FieldTypeDescriptor } from './field-type.base.js';
import { FIELD_TYPE, INDEX_TYPE } from '../../../config/constants.js';

export class TextareaFieldType extends FieldTypeDescriptor {
  constructor() {
    super({
      type: FIELD_TYPE.TEXTAREA,
      label: 'Text Area',
      icon: 'align-left',
      indexType: INDEX_TYPE.TRIE,
      supports: { unique: false, sortable: false, validation: ['minLength', 'maxLength'] },
    });
  }

  coerce(raw) {
    if (raw === null || raw === undefined) return { ok: true, value: null };
    if (typeof raw === 'object') return { ok: false, message: 'Expected a text value' };
    return { ok: true, value: String(raw) };
  }
}
