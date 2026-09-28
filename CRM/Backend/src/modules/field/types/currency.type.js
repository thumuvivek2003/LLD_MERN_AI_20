import { NumberFieldType } from './number.type.js';
import { FIELD_TYPE } from '../../../config/constants.js';

/** Currency is Number's storage semantics with money formatting — LSP-safe reuse. */
export class CurrencyFieldType extends NumberFieldType {
  constructor() {
    super({
      type: FIELD_TYPE.CURRENCY,
      label: 'Currency',
      icon: 'indian-rupee',
      supports: { unique: false, validation: ['min', 'max'] },
    });
  }

  coerce(raw) {
    const result = super.coerce(raw);
    if (!result.ok || result.value === null) return result;
    return { ok: true, value: Math.round(result.value * 100) / 100 };
  }

  display(value) {
    return this.isEmpty(value) ? '' : `₹${Number(value).toLocaleString('en-IN')}`;
  }
}
