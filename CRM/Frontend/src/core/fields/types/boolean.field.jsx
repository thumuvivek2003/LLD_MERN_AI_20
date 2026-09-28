import { Check, ToggleLeft, X } from 'lucide-react';
import { FIELD_TYPE } from '../../../shared/enums/field-type.enum.js';
import { INDEX_TYPE } from '../../../shared/enums/index-type.enum.js';
import { BOOLEAN_OPERATORS } from '../operators.js';
import { Toggle } from '../../components/ui/Toggle.jsx';
import Select from '../../components/ui/Select.jsx';

const asBool = (value) => value === true || value === 'true' || value === 1 || value === '1';

export default {
  type: FIELD_TYPE.BOOLEAN,
  label: 'Checkbox',
  icon: ToggleLeft,
  indexType: INDEX_TYPE.HASH,
  supports: { required: false, unique: false, validation: [] },
  operators: BOOLEAN_OPERATORS,
  defaultValue: () => false,
  coerce: asBool,
  validators: [],
  Input: ({ value, onChange, disabled }) => (
    <div className="flex h-9 items-center gap-2.5">
      <Toggle checked={asBool(value)} onChange={onChange} disabled={disabled} />
      <span className="text-sm text-slate-600">{asBool(value) ? 'Yes' : 'No'}</span>
    </div>
  ),
  Display: ({ value }) =>
    asBool(value) ? (
      <span className="inline-flex items-center gap-1 text-emerald-600">
        <Check size={15} strokeWidth={3} />
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-slate-300">
        <X size={15} strokeWidth={2.5} />
      </span>
    ),
  FilterWidget: ({ value, onChange, disabled }) => (
    <Select
      value={value === '' || value === null || value === undefined ? '' : String(asBool(value))}
      disabled={disabled}
      placeholder="Select…"
      onChange={(event) => onChange(event.target.value === '' ? '' : event.target.value === 'true')}
      options={[
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' },
      ]}
    />
  ),
};
