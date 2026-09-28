import { AlignLeft } from 'lucide-react';
import { FIELD_TYPE } from '../../../shared/enums/field-type.enum.js';
import { INDEX_TYPE } from '../../../shared/enums/index-type.enum.js';
import { TEXT_OPERATORS } from '../operators.js';
import { Textarea } from '../../components/ui/Input.jsx';
import { PlainInput } from './primitives.jsx';

/** TEXTAREA — multi-line string. */
export default {
  type: FIELD_TYPE.TEXTAREA,
  label: 'Long Text',
  icon: AlignLeft,
  indexType: INDEX_TYPE.TRIE,
  supports: { required: true, unique: false, validation: ['minLength', 'maxLength'] },
  operators: TEXT_OPERATORS,
  defaultValue: () => '',
  coerce: (value) => (value === null || value === undefined ? '' : String(value)),
  validators: [],
  Input: ({ field, value, onChange, invalid, disabled }) => (
    <Textarea
      rows={4}
      value={value ?? ''}
      invalid={invalid}
      disabled={disabled}
      placeholder={`Enter ${field.label.toLowerCase()}`}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
  Display: ({ value }) =>
    value ? (
      <span className="block whitespace-pre-wrap leading-relaxed">{value}</span>
    ) : (
      <span className="text-slate-300">—</span>
    ),
  FilterWidget: (props) => <PlainInput {...props} />,
};
