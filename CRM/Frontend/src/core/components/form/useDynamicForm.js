import { useCallback, useMemo, useState } from 'react';
import { coerceValue, emptyRecord, validateField, validateRecord } from '../../fields/registry.js';

/**
 * Form state machine for a metadata-driven record form.
 * Kept out of the component so DynamicForm stays presentational.
 */
export function useDynamicForm({ fields, initialValues, editableFields }) {
  const seed = useMemo(
    () => ({ ...emptyRecord(fields), ...(initialValues || {}) }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fields, JSON.stringify(initialValues || {})],
  );

  const [values, setValues] = useState(seed);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [dirty, setDirty] = useState(false);

  const setValue = useCallback((fieldId, value) => {
    setValues((current) => ({ ...current, [fieldId]: value }));
    setDirty(true);
    setErrors((current) => (current[fieldId] ? { ...current, [fieldId]: null } : current));
  }, []);

  const blurField = useCallback(
    (field) => {
      setTouched((current) => ({ ...current, [field.fieldId]: true }));
      const message = validateField(field, values[field.fieldId]);
      setErrors((current) => ({ ...current, [field.fieldId]: message }));
    },
    [values],
  );

  /** Validates only the fields this user may actually write. */
  const validate = useCallback(() => {
    const found = validateRecord(editableFields, values);
    setErrors(found);
    setTouched(editableFields.reduce((acc, field) => ({ ...acc, [field.fieldId]: true }), {}));
    return Object.keys(found).length === 0;
  }, [editableFields, values]);

  /** Coerced `recordJson` limited to writable fields — exactly what the API expects. */
  const payload = useCallback(
    () =>
      editableFields.reduce((json, field) => {
        json[field.fieldId] = coerceValue(field, values[field.fieldId]);
        return json;
      }, {}),
    [editableFields, values],
  );

  const applyServerErrors = useCallback((fieldErrors) => {
    setErrors((current) => ({ ...current, ...fieldErrors }));
    setTouched((current) => ({
      ...current,
      ...Object.keys(fieldErrors).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
    }));
  }, []);

  const reset = useCallback(() => {
    setValues(seed);
    setErrors({});
    setTouched({});
    setDirty(false);
  }, [seed]);

  return {
    values,
    errors,
    touched,
    dirty,
    setValue,
    blurField,
    validate,
    payload,
    applyServerErrors,
    reset,
  };
}

export default useDynamicForm;
