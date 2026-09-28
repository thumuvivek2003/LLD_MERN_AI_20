import { Hash } from 'lucide-react';
import { FIELD_TYPE } from '../../../shared/enums/field-type.enum.js';
import { INDEX_TYPE } from '../../../shared/enums/index-type.enum.js';
import { NUMERIC_OPERATORS } from '../operators.js';
import { formatNumber } from '../../utils/formatters.js';
import { PlainInput, PlainText } from './primitives.jsx';

const toNumber = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

/** NUMBER — integer or decimal, B-Tree indexed. */
export default {
  type: FIELD_TYPE.NUMBER,
  label: 'Number',
  icon: Hash,
  indexType: INDEX_TYPE.BTREE,
  supports: { required: true, unique: true, validation: ['min', 'max'] },
  operators: NUMERIC_OPERATORS,
  defaultValue: () => '',
  coerce: toNumber,
  validators: [
    (value) =>
      value === '' || value === null || value === undefined || !Number.isNaN(Number(value))
        ? null
        : 'Must be a number',
  ],
  Input: (props) => <PlainInput {...props} type="number" />,
  Display: ({ value }) => <PlainText value={value === null || value === '' ? null : formatNumber(value)} />,
  FilterWidget: (props) => <PlainInput {...props} type="number" />,
};
