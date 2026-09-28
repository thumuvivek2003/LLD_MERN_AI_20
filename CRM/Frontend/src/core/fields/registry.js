import { FIELD_TYPE } from '../../shared/enums/field-type.enum.js';
import { BASE_VALIDATORS, runValidators } from './validators.js';

import textField from './types/text.field.jsx';
import textareaField from './types/textarea.field.jsx';
import numberField from './types/number.field.jsx';
import currencyField from './types/currency.field.jsx';
import emailField from './types/email.field.jsx';
import phoneField from './types/phone.field.jsx';
import urlField from './types/url.field.jsx';
import dateField from './types/date.field.jsx';
import datetimeField from './types/datetime.field.jsx';
import booleanField from './types/boolean.field.jsx';
import picklistField from './types/picklist.field.jsx';
import multiPicklistField from './types/multi-picklist.field.jsx';
import lookupField from './types/lookup.field.jsx';

/**
 * FACTORY — FIELD_TYPE → strategy.
 *
 * A strategy is `{ type, label, icon, indexType, supports, operators,
 *                  defaultValue, coerce, validators, Input, Display, FilterWidget }`.
 *
 * Adding a field type = create one file in `types/` and add it to `BUILT_IN` below.
 * Nothing else in the app switches on `field.type`.
 */
const REGISTRY = new Map();

export const registerFieldType = (strategy) => {
  if (!strategy?.type) throw new Error('A field-type strategy must declare a `type`');
  REGISTRY.set(strategy.type, strategy);
  return strategy;
};

const BUILT_IN = [
  textField,
  textareaField,
  numberField,
  currencyField,
  emailField,
  phoneField,
  urlField,
  dateField,
  datetimeField,
  booleanField,
  picklistField,
  multiPicklistField,
  lookupField,
];

BUILT_IN.forEach(registerFieldType);

/** Unknown types degrade to TEXT rather than crashing a form. */
export const getFieldType = (type) => REGISTRY.get(type) || REGISTRY.get(FIELD_TYPE.TEXT);

export const fieldTypeList = () => [...REGISTRY.values()];

export const fieldTypeOptions = () =>
  fieldTypeList().map((strategy) => ({ value: strategy.type, label: strategy.label }));

export const fieldTypeIcon = (type) => getFieldType(type).icon;

export const fieldTypeLabel = (type) => getFieldType(type).label;

/** Which index the backend will build for this field type (CONTRACT §3). */
export const fieldIndexType = (type) => getFieldType(type).indexType;

export const operatorsFor = (type) => getFieldType(type).operators;

export const defaultValueFor = (field) => {
  const strategy = getFieldType(field.type);
  if (field.defaultValue !== null && field.defaultValue !== undefined && field.defaultValue !== '') {
    return strategy.coerce(field.defaultValue);
  }
  return strategy.defaultValue(field);
};

/** Shapes a value for the wire: type coercion lives with the type, not the form. */
export const coerceValue = (field, value) => getFieldType(field.type).coerce(value, field);

/**
 * Client-side mirror of the backend's validation. Base rules from the field's
 * `validation` block run first, then the type's own strategy validators.
 */
export const validateField = (field, value) =>
  runValidators([...BASE_VALIDATORS, ...(getFieldType(field.type).validators || [])], value, field);

/** Validates a whole `recordJson` against the object's fields. */
export const validateRecord = (fields, values) =>
  fields.reduce((errors, field) => {
    const message = validateField(field, values[field.fieldId]);
    if (message) errors[field.fieldId] = message;
    return errors;
  }, {});

/** Seeds a blank `recordJson` from metadata. */
export const emptyRecord = (fields) =>
  fields.reduce((record, field) => {
    record[field.fieldId] = defaultValueFor(field);
    return record;
  }, {});

export default REGISTRY;
