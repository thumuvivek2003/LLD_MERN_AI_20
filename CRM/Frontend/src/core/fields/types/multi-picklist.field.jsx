import { ListChecks } from 'lucide-react';
import { FIELD_TYPE } from '../../../shared/enums/field-type.enum.js';
import { INDEX_TYPE } from '../../../shared/enums/index-type.enum.js';
import { ENUM_OPERATORS } from '../operators.js';
import Badge from '../../components/ui/Badge.jsx';
import cx from '../../utils/cx.js';
import { optionsOf } from './picklist.field.jsx';

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const ChipPicker = ({ field, value, onChange, disabled }) => {
  const selected = toArray(value);
  const toggle = (optionValue) =>
    onChange(
      selected.includes(optionValue)
        ? selected.filter((item) => item !== optionValue)
        : [...selected, optionValue],
    );

  const options = optionsOf(field);
  if (!options.length) {
    return <p className="text-xs italic text-slate-400">No options configured for this field.</p>;
  }

  return (
    <div className="flex flex-wrap gap-1.5 rounded-lg border border-slate-200 bg-white p-2">
      {options.map((option) => {
        const active = selected.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => toggle(option.value)}
            className={cx(
              'rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset transition',
              active
                ? 'bg-accent-soft text-accent-ink ring-accent/30'
                : 'bg-white text-slate-500 ring-slate-200 hover:bg-slate-50',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

/** MULTI_PICKLIST — several choices, stored as an array. */
export default {
  type: FIELD_TYPE.MULTI_PICKLIST,
  label: 'Multi-Select Picklist',
  icon: ListChecks,
  indexType: INDEX_TYPE.HASH,
  supports: { required: true, unique: false, options: true, validation: [] },
  operators: ENUM_OPERATORS,
  defaultValue: () => [],
  coerce: (value) => toArray(value),
  validators: [],
  Input: ChipPicker,
  Display: ({ field, value }) => {
    const selected = toArray(value);
    if (!selected.length) return <span className="text-slate-300">—</span>;
    const options = optionsOf(field);
    return (
      <span className="flex flex-wrap gap-1">
        {selected.map((item) => {
          const option = options.find((candidate) => candidate.value === item);
          return (
            <Badge key={item} tone={option?.color || 'slate'}>
              {option?.label || item}
            </Badge>
          );
        })}
      </span>
    );
  },
  FilterWidget: ChipPicker,
};
