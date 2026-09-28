import { FIELD_TYPE, LOOKUP_ON_DELETE } from '../enums/field-type.enum.js';
import { toApiName } from '../../core/utils/formatters.js';

/** Blank state for the Add Field wizard. */
export const emptyFieldDraft = (type = FIELD_TYPE.TEXT) => ({
  label: '',
  apiName: '',
  type,
  required: false,
  unique: false,
  readOnly: false,
  searchable: true,
  sortable: true,
  filterable: true,
  defaultValue: '',
  helpText: '',
  options: [],
  lookup: { objectId: '', displayFieldId: '', onDelete: LOOKUP_ON_DELETE.RESTRICT },
  validation: { min: null, max: null, minLength: null, maxLength: null, regex: null, message: null },
});

/** Hydrates the Edit Field screens from a server Field document. */
export const toFieldDraft = (field) => ({
  ...emptyFieldDraft(field.type),
  ...field,
  options: field.options || [],
  lookup: field.lookup || { objectId: '', displayFieldId: '', onDelete: LOOKUP_ON_DELETE.RESTRICT },
  validation: { ...emptyFieldDraft().validation, ...(field.validation || {}) },
});

const cleanValidation = (validation = {}) => ({
  min: numberOrNull(validation.min),
  max: numberOrNull(validation.max),
  minLength: numberOrNull(validation.minLength),
  maxLength: numberOrNull(validation.maxLength),
  regex: validation.regex?.trim() || null,
  message: validation.message?.trim() || null,
});

const numberOrNull = (value) =>
  value === '' || value === null || value === undefined || Number.isNaN(Number(value))
    ? null
    : Number(value);

/** `POST /objects/:oid/fields` body — server assigns `fieldId` and `order`. */
export const toFieldPayload = (draft) => {
  const payload = {
    label: draft.label.trim(),
    apiName: (draft.apiName || toApiName(draft.label)).trim(),
    type: draft.type,
    required: Boolean(draft.required),
    unique: Boolean(draft.unique),
    readOnly: Boolean(draft.readOnly),
    searchable: Boolean(draft.searchable),
    sortable: Boolean(draft.sortable),
    filterable: Boolean(draft.filterable),
    defaultValue: draft.defaultValue === '' ? null : draft.defaultValue,
    helpText: draft.helpText?.trim() || '',
    validation: cleanValidation(draft.validation),
  };

  if (draft.type === FIELD_TYPE.PICKLIST || draft.type === FIELD_TYPE.MULTI_PICKLIST) {
    payload.options = (draft.options || [])
      .filter((option) => option.value?.trim())
      .map((option) => ({
        value: option.value.trim(),
        label: option.label?.trim() || option.value.trim(),
        color: option.color || 'slate',
      }));
  }

  if (draft.type === FIELD_TYPE.LOOKUP) {
    payload.lookup = {
      objectId: draft.lookup?.objectId,
      displayFieldId: draft.lookup?.displayFieldId,
      onDelete: draft.lookup?.onDelete || LOOKUP_ON_DELETE.RESTRICT,
    };
  }

  return payload;
};

export const validateFieldDraft = (draft) => {
  const errors = {};
  if (!draft.label?.trim()) errors.label = 'Field label is required';
  if (!draft.apiName?.trim()) errors.apiName = 'Field API name is required';
  else if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(draft.apiName))
    errors.apiName = 'Use letters, numbers and underscores; start with a letter';
  if (!draft.type) errors.type = 'Choose a field type';

  const needsOptions =
    draft.type === FIELD_TYPE.PICKLIST || draft.type === FIELD_TYPE.MULTI_PICKLIST;
  if (needsOptions && !(draft.options || []).some((option) => option.value?.trim())) {
    errors.options = 'Add at least one option';
  }

  if (draft.type === FIELD_TYPE.LOOKUP) {
    if (!draft.lookup?.objectId) errors.lookupObject = 'Choose the related object';
    if (!draft.lookup?.displayFieldId) errors.lookupDisplay = 'Choose the display field';
  }

  if (draft.validation?.regex) {
    try {
      new RegExp(draft.validation.regex);
    } catch {
      errors.regex = 'Not a valid regular expression';
    }
  }

  return errors;
};
