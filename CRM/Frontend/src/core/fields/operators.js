import { OPERATOR } from '../../shared/enums/operator.enum.js';

/**
 * Operator sets by value shape. A field type picks one instead of listing operators
 * by hand, so adding an operator to "all text-ish fields" is a one-line change here.
 */
export const TEXT_OPERATORS = [
  OPERATOR.eq,
  OPERATOR.neq,
  OPERATOR.contains,
  OPERATOR.startsWith,
  OPERATOR.endsWith,
  OPERATOR.in,
  OPERATOR.isEmpty,
  OPERATOR.isNotEmpty,
];

export const NUMERIC_OPERATORS = [
  OPERATOR.eq,
  OPERATOR.neq,
  OPERATOR.gt,
  OPERATOR.gte,
  OPERATOR.lt,
  OPERATOR.lte,
  OPERATOR.between,
  OPERATOR.isEmpty,
  OPERATOR.isNotEmpty,
];

export const DATE_OPERATORS = [
  OPERATOR.eq,
  OPERATOR.neq,
  OPERATOR.gt,
  OPERATOR.gte,
  OPERATOR.lt,
  OPERATOR.lte,
  OPERATOR.between,
  OPERATOR.isEmpty,
  OPERATOR.isNotEmpty,
];

export const ENUM_OPERATORS = [
  OPERATOR.eq,
  OPERATOR.neq,
  OPERATOR.in,
  OPERATOR.isEmpty,
  OPERATOR.isNotEmpty,
];

export const BOOLEAN_OPERATORS = [OPERATOR.eq, OPERATOR.neq];

export const REFERENCE_OPERATORS = [
  OPERATOR.eq,
  OPERATOR.neq,
  OPERATOR.in,
  OPERATOR.isEmpty,
  OPERATOR.isNotEmpty,
];
