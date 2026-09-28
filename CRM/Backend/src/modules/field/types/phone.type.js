import { FieldTypeDescriptor } from './field-type.base.js';
import { FIELD_TYPE, INDEX_TYPE } from '../../../config/constants.js';

export class PhoneFieldType extends FieldTypeDescriptor {
  constructor() {
    super({
      type: FIELD_TYPE.PHONE,
      label: 'Phone',
      icon: 'phone',
      indexType: INDEX_TYPE.HASH,
      supports: { unique: true, validation: ['regex', 'minLength', 'maxLength'] },
    });
  }

  coerce(raw) {
    if (raw === null || raw === undefined || raw === '') return { ok: true, value: null };
    if (typeof raw === 'object') return { ok: false, message: 'Expected a phone number' };
    return { ok: true, value: String(raw).trim() };
  }
}
