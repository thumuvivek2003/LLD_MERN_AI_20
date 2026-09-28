import { FieldTypeDescriptor } from './field-type.base.js';
import { FIELD_TYPE, INDEX_TYPE } from '../../../config/constants.js';

export class UrlFieldType extends FieldTypeDescriptor {
  constructor() {
    super({
      type: FIELD_TYPE.URL,
      label: 'URL',
      icon: 'link',
      indexType: INDEX_TYPE.HASH,
      supports: { unique: false, validation: ['regex'] },
    });
  }

  coerce(raw) {
    if (raw === null || raw === undefined || raw === '') return { ok: true, value: null };
    if (typeof raw === 'object') return { ok: false, message: 'Expected a URL' };
    return { ok: true, value: String(raw).trim() };
  }
}
