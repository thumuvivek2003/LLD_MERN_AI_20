import { useId } from 'react';
import { getFieldType } from '../../fields/registry.js';
import cx from '../../utils/cx.js';
import ValidationMessage, { HelpText } from './ValidationMessage.jsx';

/**
 * The Factory's consumer. Resolves a field's strategy from the registry and renders
 * the requested face of it. There is deliberately no `switch (field.type)` here —
 * or anywhere else in the app.
 *
 * `mode`:
 *   'input'   → labelled editor (used by DynamicForm)
 *   'display' → read-only value (used by tables and detail panels)
 *   'filter'  → value widget for a filter row (used by FilterBar)
 */
export function FieldRenderer({
  field,
  value,
  onChange,
  mode = 'input',
  error,
  disabled = false,
  readOnly = false,
  context,
  hideLabel = false,
  className,
}) {
  const autoId = useId();
  if (!field) return null;
  const strategy = getFieldType(field.type);
  // One id pair per rendered field so the <label> and its control are
  // programmatically associated. Custom widgets (toggle, lookup, chips) are not
  // labelable elements, so they receive `aria-labelledby` instead.
  const controlId = `mf-${autoId}-${field.fieldId}`;
  const labelId = `${controlId}-label`;

  if (mode === 'display') {
    const Display = strategy.Display;
    return <Display field={field} value={value} context={context} />;
  }

  if (mode === 'filter') {
    const FilterWidget = strategy.FilterWidget;
    return (
      <FilterWidget
        field={field}
        value={value}
        onChange={onChange}
        disabled={disabled}
        context={context}
      />
    );
  }

  // A read-only field renders its Display face inside the form flow, never a locked input.
  if (readOnly) {
    const Display = strategy.Display;
    return (
      <div className={className}>
        {!hideLabel && <FieldLabel field={field} readOnly id={labelId} />}
        <div className="flex min-h-9 items-center rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 ring-1 ring-inset ring-slate-100">
          <Display field={field} value={value} context={context} />
        </div>
        <HelpText text={field.helpText} />
      </div>
    );
  }

  const Input = strategy.Input;
  return (
    <div className={className}>
      {!hideLabel && <FieldLabel field={field} id={labelId} htmlFor={controlId} />}
      <Input
        field={field}
        value={value}
        onChange={onChange}
        invalid={Boolean(error)}
        disabled={disabled}
        context={context}
        id={controlId}
        aria-labelledby={hideLabel ? undefined : labelId}
        aria-invalid={error ? true : undefined}
      />
      <ValidationMessage message={error} />
      {!error && <HelpText text={field.helpText} />}
    </div>
  );
}

export function FieldLabel({ field, readOnly = false, id, htmlFor }) {
  const strategy = getFieldType(field.type);
  const Icon = strategy.icon;
  return (
    <label id={id} htmlFor={htmlFor} className={cx('mf-label flex items-center gap-1.5')}>
      <Icon size={12} className="text-slate-400" />
      {field.label}
      {field.required && !readOnly && <span className="text-rose-500">*</span>}
      {readOnly && <span className="ml-1 text-[10px] font-normal text-slate-400">(read only)</span>}
    </label>
  );
}

export default FieldRenderer;
