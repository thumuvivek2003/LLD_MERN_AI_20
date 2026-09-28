import { Phone } from 'lucide-react';
import { FIELD_TYPE } from '../../../shared/enums/field-type.enum.js';
import { INDEX_TYPE } from '../../../shared/enums/index-type.enum.js';
import { TEXT_OPERATORS } from '../operators.js';
import { formatValidator } from '../validators.js';
import { LinkText, PlainInput } from './primitives.jsx';

/** PHONE — loosely validated dial string, rendered as a tel: link. */
export default {
  type: FIELD_TYPE.PHONE,
  label: 'Phone',
  icon: Phone,
  indexType: INDEX_TYPE.HASH,
  supports: { required: true, unique: true, validation: ['regex'] },
  operators: TEXT_OPERATORS,
  defaultValue: () => '',
  coerce: (value) => (value ? String(value).trim() : ''),
  validators: [formatValidator('phone', 'Enter a valid phone number')],
  Input: (props) => <PlainInput {...props} type="tel" />,
  Display: ({ value }) => <LinkText href={value ? `tel:${value}` : ''} label={value} />,
  FilterWidget: (props) => <PlainInput {...props} type="text" />,
};
