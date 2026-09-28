import { Link2 } from 'lucide-react';
import { FIELD_TYPE } from '../../../shared/enums/field-type.enum.js';
import { INDEX_TYPE } from '../../../shared/enums/index-type.enum.js';
import { TEXT_OPERATORS } from '../operators.js';
import { formatValidator } from '../validators.js';
import { LinkText, PlainInput } from './primitives.jsx';

/** URL — http(s) address. */
export default {
  type: FIELD_TYPE.URL,
  label: 'URL',
  icon: Link2,
  indexType: INDEX_TYPE.HASH,
  supports: { required: true, unique: false, validation: ['regex'] },
  operators: TEXT_OPERATORS,
  defaultValue: () => '',
  coerce: (value) => (value ? String(value).trim() : ''),
  validators: [formatValidator('url', 'Enter a valid URL starting with http:// or https://')],
  Input: (props) => <PlainInput {...props} type="url" placeholder="https://example.com" />,
  Display: ({ value }) => <LinkText href={value} label={value} />,
  FilterWidget: (props) => <PlainInput {...props} type="text" />,
};
