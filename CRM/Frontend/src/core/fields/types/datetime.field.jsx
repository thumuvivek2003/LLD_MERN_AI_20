import { CalendarClock } from 'lucide-react';
import { FIELD_TYPE } from '../../../shared/enums/field-type.enum.js';
import { INDEX_TYPE } from '../../../shared/enums/index-type.enum.js';
import { DATE_OPERATORS } from '../operators.js';
import { formatDateTime } from '../../utils/formatters.js';
import { Input } from '../../components/ui/Input.jsx';
import { PlainText } from './primitives.jsx';

/** Rendered as a local `datetime-local` value, sent as an ISO string. */
const toLocalInput = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const DateTimeInput = ({ value, onChange, invalid, disabled, field: _field, context: _context, ...rest }) => (
  <Input
    type="datetime-local"
    value={toLocalInput(value)}
    invalid={invalid}
    disabled={disabled}
    onChange={(event) => onChange(event.target.value)}
    {...rest}
  />
);

export default {
  type: FIELD_TYPE.DATETIME,
  label: 'Date / Time',
  icon: CalendarClock,
  indexType: INDEX_TYPE.BTREE,
  supports: { required: true, unique: false, validation: ['min', 'max'] },
  operators: DATE_OPERATORS,
  defaultValue: () => '',
  coerce: (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  },
  validators: [],
  Input: DateTimeInput,
  Display: ({ value }) => <PlainText value={value ? formatDateTime(value) : null} />,
  FilterWidget: DateTimeInput,
};
