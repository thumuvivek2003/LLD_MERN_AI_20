import { Link } from 'lucide-react';
import { FIELD_TYPE } from '../../../shared/enums/field-type.enum.js';
import { INDEX_TYPE } from '../../../shared/enums/index-type.enum.js';
import { REFERENCE_OPERATORS } from '../operators.js';
import LookupPicker from '../../components/form/LookupPicker.jsx';

/**
 * LOOKUP — a foreign key to another object's record.
 * `context.resolved[fieldId]` (from the record payload) supplies the display name
 * so the picker shows "Hitech Solutions" rather than "acc_101".
 */
export default {
  type: FIELD_TYPE.LOOKUP,
  label: 'Lookup Relationship',
  icon: Link,
  indexType: INDEX_TYPE.HASH,
  supports: { required: true, unique: false, lookup: true, validation: [] },
  operators: REFERENCE_OPERATORS,
  defaultValue: () => null,
  coerce: (value) => value || null,
  validators: [],
  Input: ({ field, value, onChange, disabled, invalid, context, 'aria-labelledby': labelledBy }) => (
    <LookupPicker
      aria-labelledby={labelledBy}
      targetObjectId={field.lookup?.objectId}
      value={value}
      displayName={context?.resolved?.[field.fieldId]?.displayName}
      disabled={disabled}
      invalid={invalid}
      onChange={(recordId) => onChange(recordId)}
      placeholder={`Select ${field.label.toLowerCase()}`}
    />
  ),
  Display: ({ field, value, context }) => {
    if (!value) return <span className="text-slate-300">—</span>;
    const resolved = context?.resolved?.[field.fieldId];
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200">
        <Link size={11} className="text-slate-400" />
        {resolved?.displayName || value}
      </span>
    );
  },
  FilterWidget: ({ field, value, onChange, disabled }) => (
    <LookupPicker
      targetObjectId={field.lookup?.objectId}
      value={value}
      disabled={disabled}
      onChange={(recordId) => onChange(recordId ?? '')}
      placeholder="Any record"
    />
  ),
};
