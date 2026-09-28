import { List } from 'lucide-react';
import { FIELD_TYPE } from '../../../shared/enums/field-type.enum.js';
import { INDEX_TYPE } from '../../../shared/enums/index-type.enum.js';
import { ENUM_OPERATORS } from '../operators.js';
import Select from '../../components/ui/Select.jsx';
import Badge from '../../components/ui/Badge.jsx';

export const optionsOf = (field) =>
  (field?.options || []).map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option,
  );

const PicklistSelect = ({ field, value, onChange, invalid, disabled }) => (
  <Select
    value={value ?? ''}
    invalid={invalid}
    disabled={disabled}
    placeholder={`Select ${field.label.toLowerCase()}`}
    onChange={(event) => onChange(event.target.value)}
    options={optionsOf(field)}
  />
);

/** PICKLIST — single choice from admin-defined options, each with its own colour. */
export default {
  type: FIELD_TYPE.PICKLIST,
  label: 'Picklist',
  icon: List,
  indexType: INDEX_TYPE.HASH,
  supports: { required: true, unique: false, options: true, validation: [] },
  operators: ENUM_OPERATORS,
  defaultValue: (field) => field?.defaultValue ?? '',
  coerce: (value) => (value === '' ? null : value),
  validators: [],
  Input: PicklistSelect,
  Display: ({ field, value }) => {
    if (!value) return <span className="text-slate-300">—</span>;
    const option = optionsOf(field).find((item) => item.value === value);
    return <Badge tone={option?.color || 'slate'}>{option?.label || value}</Badge>;
  },
  FilterWidget: PicklistSelect,
};
