import { OPERATOR } from '../../../config/constants.js';
import { BadRequestError } from '../../../core/exceptions/bad-request.error.js';

const str = (v) => (v === null || v === undefined ? '' : String(v).toLowerCase());
const num = (v) => (v === null || v === undefined || v === '' ? null : Number(v));
const isEmptyValue = (v) => v === null || v === undefined || v === '' || (Array.isArray(v) && !v.length);
const arrayOf = (v) => (Array.isArray(v) ? v : [v]);

/**
 * Operator strategies.
 *
 * Every operator declares two things:
 *   `arity`    — how the operand is shaped (used for request validation)
 *   `evaluate` — the in-memory fallback used when no index can serve it
 *
 * The index path is separate: a strategy advertises which operators it supports
 * via `IIndexStrategy.operators`. The planner tries the index first and only
 * falls back to `evaluate` as a residual filter.
 *
 * Adding an operator = one entry here + (optionally) listing it in a strategy.
 */
const OPERATORS = {
  [OPERATOR.eq]: {
    arity: 'single',
    evaluate: (actual, operand) => (Array.isArray(actual) ? actual.map(str).includes(str(operand)) : str(actual) === str(operand)),
  },
  [OPERATOR.neq]: {
    arity: 'single',
    evaluate: (actual, operand) => str(actual) !== str(operand),
  },
  [OPERATOR.contains]: {
    arity: 'single',
    evaluate: (actual, operand) => str(actual).includes(str(operand)),
  },
  [OPERATOR.startsWith]: {
    arity: 'single',
    evaluate: (actual, operand) => str(actual).startsWith(str(operand)),
  },
  [OPERATOR.endsWith]: {
    arity: 'single',
    evaluate: (actual, operand) => str(actual).endsWith(str(operand)),
  },
  [OPERATOR.gt]: {
    arity: 'single',
    evaluate: (actual, operand, numeric) => compare(actual, operand, numeric) > 0,
  },
  [OPERATOR.gte]: {
    arity: 'single',
    evaluate: (actual, operand, numeric) => compare(actual, operand, numeric) >= 0,
  },
  [OPERATOR.lt]: {
    arity: 'single',
    evaluate: (actual, operand, numeric) => compare(actual, operand, numeric) < 0,
  },
  [OPERATOR.lte]: {
    arity: 'single',
    evaluate: (actual, operand, numeric) => compare(actual, operand, numeric) <= 0,
  },
  [OPERATOR.in]: {
    arity: 'list',
    evaluate: (actual, operand) => arrayOf(operand).map(str).includes(str(actual)),
  },
  [OPERATOR.between]: {
    arity: 'pair',
    evaluate: (actual, operand, numeric) => {
      const [lo, hi] = arrayOf(operand);
      return compare(actual, lo, numeric) >= 0 && compare(actual, hi, numeric) <= 0;
    },
  },
  [OPERATOR.isEmpty]: { arity: 'none', evaluate: (actual) => isEmptyValue(actual) },
  [OPERATOR.isNotEmpty]: { arity: 'none', evaluate: (actual) => !isEmptyValue(actual) },
};

function compare(actual, operand, numeric) {
  if (numeric) {
    const a = num(actual);
    const b = num(operand);
    if (a === null) return -1;
    return a === b ? 0 : a < b ? -1 : 1;
  }
  const a = String(actual ?? '');
  const b = String(operand ?? '');
  return a === b ? 0 : a < b ? -1 : 1;
}

export const operatorRegistry = {
  has: (op) => Object.hasOwn(OPERATORS, op),

  get(op) {
    const strategy = OPERATORS[op];
    if (!strategy) throw new BadRequestError(`Unsupported operator '${op}'`);
    return strategy;
  },

  list: () => Object.keys(OPERATORS),

  /** Shape-check a filter's operand against its operator. */
  assertOperand(op, value) {
    const { arity } = operatorRegistry.get(op);
    if (arity === 'none') return;
    if (arity === 'list' && !Array.isArray(value)) throw new BadRequestError(`Operator '${op}' expects an array value`);
    if (arity === 'pair' && (!Array.isArray(value) || value.length !== 2)) {
      throw new BadRequestError(`Operator '${op}' expects a [from, to] array`);
    }
    if (arity === 'single' && (value === undefined || value === null)) {
      throw new BadRequestError(`Operator '${op}' requires a value`);
    }
  },
};
