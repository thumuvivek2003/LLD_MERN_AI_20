import { DateFieldType } from './date.type.js';
import { FIELD_TYPE } from '../../../config/constants.js';

export class DateTimeFieldType extends DateFieldType {
  constructor() {
    super({ type: FIELD_TYPE.DATETIME, label: 'Date & Time', icon: 'clock' });
  }

  coerce(raw) {
    if (raw === null || raw === undefined || raw === '') return { ok: true, value: null };
    const d = raw instanceof Date ? raw : new Date(raw);
    if (Number.isNaN(d.getTime())) return { ok: false, message: 'Expected a valid date/time' };
    return { ok: true, value: d.toISOString() };
  }
}
