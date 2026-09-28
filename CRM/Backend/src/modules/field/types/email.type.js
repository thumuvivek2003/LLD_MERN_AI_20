import { FieldTypeDescriptor } from './field-type.base.js';
import { FIELD_TYPE, INDEX_TYPE } from '../../../config/constants.js';

export class EmailFieldType extends FieldTypeDescriptor {
  constructor() {
    super({
      type: FIELD_TYPE.EMAIL,
      label: 'Email',
      icon: 'mail',
      indexType: INDEX_TYPE.HASH,
      supports: { unique: true, validation: ['regex'] },
    });
  }

  coerce(raw) {
    if (raw === null || raw === undefined || raw === '') return { ok: true, value: null };
    if (typeof raw === 'object') return { ok: false, message: 'Expected an email address' };
    return { ok: true, value: String(raw).trim().toLowerCase() };
  }
}
