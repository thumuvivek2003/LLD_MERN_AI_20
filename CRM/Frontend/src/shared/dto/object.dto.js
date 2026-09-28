import { toApiName, toSlug, pluralise } from '../../core/utils/formatters.js';

/** Blank state for the Create Object wizard. */
export const emptyObjectDraft = () => ({
  label: '',
  pluralLabel: '',
  apiName: '',
  description: '',
  icon: 'box',
  color: 'indigo',
});

/** Keeps apiName / pluralLabel in step with the label until the user overrides them. */
export const deriveObjectDraft = (draft, label) => ({
  ...draft,
  label,
  apiName: draft.apiNameTouched ? draft.apiName : toApiName(label),
  pluralLabel: draft.pluralTouched ? draft.pluralLabel : pluralise(label),
});

/** `POST /objects` body — CONTRACT §5.1. */
export const toCreateObjectPayload = (draft) => ({
  label: draft.label.trim(),
  pluralLabel: (draft.pluralLabel || pluralise(draft.label)).trim(),
  apiName: (draft.apiName || toApiName(draft.label)).trim(),
  description: draft.description?.trim() || '',
  icon: draft.icon || 'box',
  color: draft.color || 'indigo',
});

/** `PATCH /objects/:oid` body — only the mutable props the contract allows. */
export const toUpdateObjectPayload = (draft) => ({
  label: draft.label?.trim(),
  description: draft.description?.trim() ?? '',
  icon: draft.icon,
  color: draft.color,
  ...(draft.primaryDisplayFieldId ? { primaryDisplayFieldId: draft.primaryDisplayFieldId } : {}),
});

/** `POST /objects/:oid/clone` body. */
export const toCloneObjectPayload = ({ label, apiName, includeRecords = false }) => ({
  label: label.trim(),
  apiName: (apiName || toSlug(label)).trim(),
  includeRecords,
});

export const validateObjectDraft = (draft) => {
  const errors = {};
  if (!draft.label?.trim()) errors.label = 'Object label is required';
  if (!draft.apiName?.trim()) errors.apiName = 'API name is required';
  else if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(draft.apiName))
    errors.apiName = 'Use letters, numbers and underscores; start with a letter';
  return errors;
};
