import { ExpressionNode } from './expression.node.js';
import { operatorRegistry } from '../operators/operator.registry.js';
import { fieldTypeRegistry } from '../../field/types/field-type.registry.js';
import { FIELD_TYPE } from '../../../config/constants.js';

const NUMERIC = new Set([FIELD_TYPE.NUMBER, FIELD_TYPE.CURRENCY]);

/** Leaf of the tree: one `fieldId <operator> value` predicate. */
export class ComparisonNode extends ExpressionNode {
  constructor({ field, operator, value }) {
    super();
    this.field = field;
    this.operator = operator;
    this.value = value;
    this.indexed = false; // decided by the optimizer
    this.indexType = null;
    this.estimatedRows = Number.POSITIVE_INFINITY;
  }

  get fieldId() {
    return this.field.fieldId;
  }

  estimateCost() {
    return this.estimatedRows;
  }

  async execute(ctx) {
    const hit = ctx.indexManager.query(ctx.objectDef.objectId, this.field.fieldId, this.operator, this.value);
    if (hit) {
      ctx.plan.steps.push({
        fieldId: this.field.fieldId,
        field: this.field.label,
        operator: this.operator,
        index: hit.indexType,
        matched: hit.ids.size,
        tookMs: Math.round(hit.ms * 1000) / 1000,
      });
      ctx.indexedPredicates += 1;
      return hit.ids;
    }

    // No usable index — hand the predicate to the residual filter and stay
    // unconstrained so sibling indexed predicates can still narrow the set.
    ctx.residuals.push(this.toPredicate());
    ctx.plan.steps.push({
      fieldId: this.field.fieldId,
      field: this.field.label,
      operator: this.operator,
      index: 'NONE',
      matched: null,
      mode: 'RESIDUAL_FILTER',
    });
    ctx.residualPredicates += 1;
    return null;
  }

  /** In-memory evaluator used when the index layer cannot answer. */
  toPredicate() {
    const strategy = operatorRegistry.get(this.operator);
    const numeric = NUMERIC.has(this.field.type);
    const fieldId = this.field.fieldId;
    const operand = this.value;
    return (recordJson) => strategy.evaluate(recordJson?.[fieldId], operand, numeric);
  }

  explain() {
    return {
      kind: 'COMPARISON',
      fieldId: this.field.fieldId,
      operator: this.operator,
      indexed: this.indexed,
      indexType: this.indexType,
      estimatedRows: Number.isFinite(this.estimatedRows) ? this.estimatedRows : null,
    };
  }

  /** Descriptor access kept here so callers never import the registry themselves. */
  descriptor() {
    return fieldTypeRegistry.get(this.field.type);
  }
}
