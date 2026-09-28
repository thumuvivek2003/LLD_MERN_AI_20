import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { OPTION_COLORS } from '../../../../shared/enums/field-type.enum.js';
import { Input } from '../../../../core/components/ui/Input.jsx';
import Select from '../../../../core/components/ui/Select.jsx';
import Button from '../../../../core/components/ui/Button.jsx';
import Badge from '../../../../core/components/ui/Badge.jsx';
import ValidationMessage from '../../../../core/components/form/ValidationMessage.jsx';

/** Option rows for PICKLIST / MULTI_PICKLIST fields — value, label and pill colour. */
export function PicklistOptionsEditor({ options = [], onChange, error }) {
  const patch = (index, changes) =>
    onChange(options.map((option, i) => (i === index ? { ...option, ...changes } : option)));

  const add = () => onChange([...options, { value: '', label: '', color: 'slate' }]);
  const remove = (index) => onChange(options.filter((_, i) => i !== index));

  return (
    <div>
      <label className="mf-label">Picklist Options</label>
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <GripVertical size={14} className="shrink-0 text-slate-300" />
            <Input
              className="flex-1"
              placeholder="Stored value (ACTIVE)"
              value={option.value}
              onChange={(event) =>
                patch(index, {
                  value: event.target.value,
                  label: option.labelTouched ? option.label : event.target.value,
                })
              }
            />
            <Input
              className="flex-1"
              placeholder="Display label (Active)"
              value={option.label}
              onChange={(event) => patch(index, { label: event.target.value, labelTouched: true })}
            />
            <Select
              className="w-32"
              value={option.color || 'slate'}
              onChange={(event) => patch(index, { color: event.target.value })}
              options={OPTION_COLORS.map((color) => ({ value: color, label: color }))}
            />
            <Badge tone={option.color || 'slate'} className="hidden shrink-0 sm:inline-flex">
              {option.label || option.value || 'preview'}
            </Badge>
            <button
              type="button"
              onClick={() => remove(index)}
              aria-label="Remove option"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <ValidationMessage message={error} />
      <Button variant="soft" size="sm" icon={Plus} className="mt-2.5" onClick={add}>
        Add Option
      </Button>
    </div>
  );
}

export default PicklistOptionsEditor;
