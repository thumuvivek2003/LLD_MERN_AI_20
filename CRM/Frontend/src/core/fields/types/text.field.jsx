import { Type } from 'lucide-react';
import { FIELD_TYPE } from '../../../shared/enums/field-type.enum.js';
import { INDEX_TYPE } from '../../../shared/enums/index-type.enum.js';
import { TEXT_OPERATORS } from '../operators.js';
import { PlainInput, PlainText } from './primitives.jsx';

/** TEXT — single-line string. The registry's default strategy. */
export default {
  type: FIELD_TYPE.TEXT,
  label: 'Text',
  icon: Type,
  indexType: INDEX_TYPE.TRIE,
  supports: { required: true, unique: true, validation: ['minLength', 'maxLength', 'regex'] },
  operators: TEXT_OPERATORS,
  defaultValue: () => '',
  coerce: (value) => (value === null || value === undefined ? '' : String(value)),
  validators: [],
  Input: PlainInput,
  Display: ({ value }) => <PlainText value={value} />,
  FilterWidget: (props) => <PlainInput {...props} />,
};
