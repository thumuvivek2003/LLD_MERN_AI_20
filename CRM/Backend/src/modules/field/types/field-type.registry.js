import { TextFieldType } from './text.type.js';
import { TextareaFieldType } from './textarea.type.js';
import { NumberFieldType } from './number.type.js';
import { CurrencyFieldType } from './currency.type.js';
import { EmailFieldType } from './email.type.js';
import { PhoneFieldType } from './phone.type.js';
import { UrlFieldType } from './url.type.js';
import { DateFieldType } from './date.type.js';
import { DateTimeFieldType } from './datetime.type.js';
import { BooleanFieldType } from './boolean.type.js';
import { PicklistFieldType } from './picklist.type.js';
import { MultiPicklistFieldType } from './multi-picklist.type.js';
import { LookupFieldType } from './lookup.type.js';
import { BadRequestError } from '../../../core/exceptions/bad-request.error.js';

/**
 * THE registry. A new field type costs exactly one import + one array entry.
 * `GET /field-types` is generated from here — never hardcoded.
 */
const DESCRIPTORS = [
  new TextFieldType(),
  new TextareaFieldType(),
  new NumberFieldType(),
  new CurrencyFieldType(),
  new EmailFieldType(),
  new PhoneFieldType(),
  new UrlFieldType(),
  new DateFieldType(),
  new DateTimeFieldType(),
  new BooleanFieldType(),
  new PicklistFieldType(),
  new MultiPicklistFieldType(),
  new LookupFieldType(),
];

const BY_TYPE = new Map(DESCRIPTORS.map((d) => [d.type, d]));

export const fieldTypeRegistry = {
  has: (type) => BY_TYPE.has(type),

  get(type) {
    const descriptor = BY_TYPE.get(type);
    if (!descriptor) throw new BadRequestError(`Unknown field type '${type}'`);
    return descriptor;
  },

  list: () => [...DESCRIPTORS],

  catalogue: () => DESCRIPTORS.map((d) => d.toCatalogueEntry()),

  indexTypeFor: (type) => BY_TYPE.get(type)?.indexType ?? 'HASH',
};
