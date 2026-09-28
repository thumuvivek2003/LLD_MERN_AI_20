import { useImperativeHandle, useMemo, forwardRef } from 'react';
import cx from '../../utils/cx.js';
import usePermission from '../../hooks/usePermission.js';
import Button from '../ui/Button.jsx';
import FieldRenderer from './FieldRenderer.jsx';
import useDynamicForm from './useDynamicForm.js';

/**
 * Builds an entire create/edit form from an object's `fields[]` metadata — labels,
 * required markers, help text, picklist options, lookup pickers, read-only fields and
 * field-level permissions all come from the metadata, never from hand-written JSX.
 *
 * Server `VALIDATION_ERROR.details` are painted back onto the right inputs by `fieldId`
 * through the imperative `applyServerErrors` handle.
 */
export const DynamicForm = forwardRef(function DynamicForm(
  {
    objectId,
    fields = [],
    initialValues,
    resolved,
    title,
    description,
    columns = 2,
    submitLabel = 'Save',
    cancelLabel = 'Cancel',
    onSubmit,
    onCancel,
    submitting = false,
    footer,
  },
  ref,
) {
  const permission = usePermission(objectId);

  // Hidden fields never render; read-only ones render as text.
  const visible = useMemo(
    () =>
      permission
        .visibleFields(fields)
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [fields, permission],
  );

  const editable = useMemo(
    () => visible.filter((field) => permission.isFieldEditable(field)),
    [visible, permission],
  );

  const form = useDynamicForm({ fields: visible, initialValues, editableFields: editable });

  useImperativeHandle(ref, () => ({
    applyServerErrors: form.applyServerErrors,
    reset: form.reset,
    values: form.values,
  }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.validate()) return;
    onSubmit?.(form.payload());
  };

  if (!visible.length) {
    return (
      <p className="rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
        No fields are visible to you on this object.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {(title || description) && (
        <div>
          {title && <h3 className="text-sm font-bold text-accent">{title}</h3>}
          {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
        </div>
      )}

      <div
        className={cx(
          'grid gap-x-5 gap-y-4',
          columns === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2',
        )}
      >
        {visible.map((field) => {
          const isEditable = permission.isFieldEditable(field);
          const fullWidth = field.type === 'TEXTAREA' || field.type === 'MULTI_PICKLIST';
          return (
            <div
              key={field.fieldId}
              className={cx(columns > 1 && fullWidth && 'md:col-span-2')}
              onBlur={() => isEditable && form.blurField(field)}
            >
              <FieldRenderer
                field={field}
                value={form.values[field.fieldId]}
                onChange={(value) => form.setValue(field.fieldId, value)}
                error={form.touched[field.fieldId] ? form.errors[field.fieldId] : null}
                readOnly={!isEditable}
                disabled={submitting}
                context={{ resolved }}
              />
            </div>
          );
        })}
      </div>

      {footer ?? (
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
              {cancelLabel}
            </Button>
          )}
          <Button type="submit" loading={submitting}>
            {submitLabel}
          </Button>
        </div>
      )}
    </form>
  );
});

export default DynamicForm;
