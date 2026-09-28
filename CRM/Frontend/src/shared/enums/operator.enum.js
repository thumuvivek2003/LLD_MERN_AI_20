export const OPERATOR = {
  eq: 'eq',
  neq: 'neq',
  contains: 'contains',
  startsWith: 'startsWith',
  endsWith: 'endsWith',
  gt: 'gt',
  gte: 'gte',
  lt: 'lt',
  lte: 'lte',
  in: 'in',
  between: 'between',
  isEmpty: 'isEmpty',
  isNotEmpty: 'isNotEmpty',
};

export const OPERATOR_LABEL = {
  eq: 'equals',
  neq: 'not equals',
  contains: 'contains',
  startsWith: 'starts with',
  endsWith: 'ends with',
  gt: 'greater than',
  gte: 'greater or equal',
  lt: 'less than',
  lte: 'less or equal',
  in: 'is any of',
  between: 'between',
  isEmpty: 'is empty',
  isNotEmpty: 'is not empty',
};

/** Operators that take no value at all — the filter row hides its value widget. */
export const VALUELESS_OPERATORS = [OPERATOR.isEmpty, OPERATOR.isNotEmpty];

/** Operators whose value is a pair — the filter row renders two widgets. */
export const RANGE_OPERATORS = [OPERATOR.between];

/** Operators whose value is a list. */
export const MULTI_OPERATORS = [OPERATOR.in];

export const FILTER_LOGIC = {
  AND: 'AND',
  OR: 'OR',
};
