import { AndNode } from './nodes/and.node.js';
import { OrNode } from './nodes/or.node.js';
import { ComparisonNode } from './nodes/comparison.node.js';
import { operatorRegistry } from './operators/operator.registry.js';
import { fieldTypeRegistry } from '../field/types/field-type.registry.js';
import { FILTER_LOGIC } from '../../config/constants.js';
import { BadRequestError } from '../../core/exceptions/bad-request.error.js';

/** Filter operands go through the same type coercion as stored values. */
function coerceOperand(field, value) {
  if (value === null || value === undefined) return value;
  const descriptor = fieldTypeRegistry.get(field.type);
  const one = (v) => {
    const result = descriptor.coerce(v);
    return result.ok ? result.value : v;
  };
  return Array.isArray(value) ? value.map(one) : one(value);
}

function buildNode(filter, byId, objectDef) {
  // A filter may itself be a group — the Composite handles nesting for free.
  if (Array.isArray(filter.filters)) {
    const nested = filter.filters.map((f) => buildNode(f, byId, objectDef));
    return filter.logic === FILTER_LOGIC.OR ? new OrNode(nested) : new AndNode(nested);
  }

  const field = byId.get(filter.fieldId);
  if (!field) throw new BadRequestError(`Unknown fieldId '${filter.fieldId}' on object '${objectDef.objectId}'`);
  if (!operatorRegistry.has(filter.operator)) throw new BadRequestError(`Unsupported operator '${filter.operator}'`);
  operatorRegistry.assertOperand(filter.operator, filter.value);

  return new ComparisonNode({ field, operator: filter.operator, value: coerceOperand(field, filter.value) });
}

/**
 * Query Parser — the contract's flat `filters[]` + `logic` become an expression
 * tree. Flat today, nested tomorrow: the Composite already supports grouping, so
 * a nested filter builder needs no engine change.
 */
export const QueryParser = {
  parse({ filters = [], logic = FILTER_LOGIC.AND }, objectDef) {
    const byId = new Map(objectDef.fields.map((f) => [f.fieldId, f]));
    const children = filters.map((filter) => buildNode(filter, byId, objectDef));
    return logic === FILTER_LOGIC.OR ? new OrNode(children) : new AndNode(children);
  },
};
