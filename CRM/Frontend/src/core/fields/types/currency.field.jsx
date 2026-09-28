import { IndianRupee } from 'lucide-react';
import { FIELD_TYPE } from '../../../shared/enums/field-type.enum.js';
import { INDEX_TYPE } from '../../../shared/enums/index-type.enum.js';
import { NUMERIC_OPERATORS } from '../operators.js';
import { formatCurrency } from '../../utils/formatters.js';
import { PlainInput, PlainText } from './primitives.jsx';

/** CURRENCY — money amount rendered with the locale currency formatter. */
export default {
  type: FIELD_TYPE.CURRENCY,
  label: 'Currency',
  icon: IndianRupee,
  indexType: INDEX_TYPE.BTREE,
  supports: { required: true, unique: false, validation: ['min', 'max'] },
  operators: NUMERIC_OPERATORS,
  defaultValue: () => '',
  coerce: (value) => {
    if (value === '' || value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  },
  validators: [
    (value) =>
      value === '' || value === null || value === undefined || !Number.isNaN(Number(value))
        ? null
        : 'Must be an amount',
  ],
  Input: (props) => <PlainInput {...props} type="number" step="0.01" prefix="₹" />,
  Display: ({ value }) => (
    <PlainText value={value === null || value === '' ? null : formatCurrency(value)} />
  ),
  FilterWidget: (props) => <PlainInput {...props} type="number" step="0.01" />,
};
