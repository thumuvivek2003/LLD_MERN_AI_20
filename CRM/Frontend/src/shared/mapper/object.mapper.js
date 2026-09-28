import { resolveIcon } from '../../core/utils/icons.js';

/** View-model for the object tiles and pickers. */
export const toObjectOption = (object) => ({
  value: object.objectId,
  label: object.pluralLabel || object.label,
});

export const objectIcon = (object) => resolveIcon(object?.icon);

/** Fields the record list is allowed to sort by. */
export const sortableFields = (fields = []) => fields.filter((field) => field.sortable !== false);

/** Fields the search index can serve. */
export const searchableFields = (fields = []) => fields.filter((field) => field.searchable);

export const fieldById = (fields = [], fieldId) =>
  fields.find((field) => field.fieldId === fieldId) || null;

export const primaryField = (object) =>
  fieldById(object?.fields, object?.primaryDisplayFieldId) || object?.fields?.[0] || null;
