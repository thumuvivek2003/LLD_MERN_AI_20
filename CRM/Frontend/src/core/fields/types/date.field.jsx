import { Calendar } from 'lucide-react';
import { FIELD_TYPE } from '../../../shared/enums/field-type.enum.js';
import { INDEX_TYPE } from '../../../shared/enums/index-type.enum.js';
import { DATE_OPERATORS } from '../operators.js';
import { formatDate } from '../../utils/formatters.js';
import { Input } from '../../components/ui/Input.jsx';
import { PlainText } from './primitives.jsx';

/** Stored and sent as `YYYY-MM-DD`. */
export const toDateInput = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value).slice(0, 10) : date.toISOString().slice(0, 10);
};

const DateInput = ({ value, onChange, invalid, disabled, field: _field, context: _context, ...rest }) => (
  <Input
    type="date"
    value={toDateInput(value)}
    invalid={invalid}
    disabled={disabled}
    onChange={(event) => onChange(event.target.value)}
    {...rest}
  />
);

export default {
  type: FIELD_TYPE.DATE,
  label: 'Date',
  icon: Calendar,
  indexType: INDEX_TYPE.BTREE,
  supports: { required: true, unique: false, validation: ['min', 'max'] },
  operators: DATE_OPERATORS,
  defaultValue: () => '',
  coerce: (value) => (value ? toDateInput(value) : null),
  validators: [],
  Input: DateInput,
  Display: ({ value }) => <PlainText value={value ? formatDate(value) : null} />,
  FilterWidget: DateInput,
};
