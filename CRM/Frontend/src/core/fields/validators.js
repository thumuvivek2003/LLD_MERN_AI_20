/**
 * Strategy set for client-side validation. Each validator has the same signature
 * `(value, field) => string | null`, so the runner never branches on field type.
 * Mirrors the `validation` block in CONTRACT §4 (Field).
 */

export const isBlank = (value) =>
  value === null ||
  value === undefined ||
  value === '' ||
  (Array.isArray(value) && value.length === 0);

const required = (value, field) =>
  field.required && isBlank(value) ? `${field.label} is required` : null;

const minLength = (value, field) => {
  const min = field.validation?.minLength;
  if (min == null || isBlank(value)) return null;
  return String(value).length < min ? `Must be at least ${min} characters` : null;
};

const maxLength = (value, field) => {
  const max = field.validation?.maxLength;
  if (max == null || isBlank(value)) return null;
  return String(value).length > max ? `Must be at most ${max} characters` : null;
};

const min = (value, field) => {
  const bound = field.validation?.min;
  if (bound == null || isBlank(value)) return null;
  return Number(value) < Number(bound) ? `Must be ${bound} or more` : null;
};

const max = (value, field) => {
  const bound = field.validation?.max;
  if (bound == null || isBlank(value)) return null;
  return Number(value) > Number(bound) ? `Must be ${bound} or less` : null;
};

const regex = (value, field) => {
  const pattern = field.validation?.regex;
  if (!pattern || isBlank(value)) return null;
  try {
    return new RegExp(pattern).test(String(value))
      ? null
      : field.validation?.message || `${field.label} does not match the required format`;
  } catch {
    return null; // an unparsable admin-authored regex must not block the user
  }
};

/** Runs in order; first failure wins. Type-specific rules are appended by the registry. */
export const BASE_VALIDATORS = [required, minLength, maxLength, min, max, regex];

export const runValidators = (validators, value, field) => {
  for (const validate of validators) {
    const message = validate(value, field);
    if (message) return message;
  }
  return null;
};

/** Reusable format checkers exposed to the EMAIL / URL / PHONE strategies. */
export const FORMATS = {
  email: /^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/,
  url: /^https?:\/\/[^\s/$.?#].[^\s]*$/i,
  phone: /^[+]?[\d\s()-]{7,20}$/,
};

export const formatValidator = (kind, message) => (value) =>
  isBlank(value) || FORMATS[kind].test(String(value).trim()) ? null : message;
