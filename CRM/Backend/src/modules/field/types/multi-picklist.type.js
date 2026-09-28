import { PicklistFieldType } from './picklist.type.js';
import { EMPTY_KEY } from './field-type.base.js';
import { FIELD_TYPE } from '../../../config/constants.js';

/** Multi-valued: one record contributes several keys to its HASH index. */
export class MultiPicklistFieldType extends PicklistFieldType {
  constructor() {
    super({ type: FIELD_TYPE.MULTI_PICKLIST, label: 'Multi-select Picklist', icon: 'list-checks' });
    this.supports.sortable = false;
  }

  isEmpty(value) {
    return !Array.isArray(value) || value.length === 0;
  }

  coerce(raw) {
    if (raw === null || raw === undefined || raw === '') return { ok: true, value: [] };
    const arr = Array.isArray(raw) ? raw : String(raw).split(';');
    return { ok: true, value: arr.map((v) => String(v).trim()).filter(Boolean) };
  }

  indexKeys(value) {
    return this.isEmpty(value) ? [EMPTY_KEY] : value.map(String);
  }

  sortValue(value) {
    return this.isEmpty(value) ? '' : value.join(';');
  }

  display(value) {
    return this.isEmpty(value) ? '' : value.join(', ');
  }
}
