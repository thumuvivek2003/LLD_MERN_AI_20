import { Mail } from 'lucide-react';
import { FIELD_TYPE } from '../../../shared/enums/field-type.enum.js';
import { INDEX_TYPE } from '../../../shared/enums/index-type.enum.js';
import { TEXT_OPERATORS } from '../operators.js';
import { formatValidator } from '../validators.js';
import { LinkText, PlainInput } from './primitives.jsx';

/** EMAIL — text plus a format strategy and a mailto display. */
export default {
  type: FIELD_TYPE.EMAIL,
  label: 'Email',
  icon: Mail,
  indexType: INDEX_TYPE.HASH,
  supports: { required: true, unique: true, validation: ['regex'] },
  operators: TEXT_OPERATORS,
  defaultValue: () => '',
  coerce: (value) => (value ? String(value).trim() : ''),
  validators: [formatValidator('email', 'Enter a valid email address')],
  Input: (props) => <PlainInput {...props} type="email" autoComplete="off" />,
  Display: ({ value }) => <LinkText href={value ? `mailto:${value}` : ''} label={value} />,
  FilterWidget: (props) => <PlainInput {...props} type="text" />,
};
