import { AndNode } from './nodes/and.node.js';
import { ComparisonNode } from './nodes/comparison.node.js';
import { OPERATOR, INDEX_STATUS } from '../../config/constants.js';

/** Rough share of rows an operator is expected to return, given N distinct keys. */
const SELECTIVITY = {
  [OPERATOR.eq]: (rows, keys) => rows / Math.max(1, keys),
  [OPERATOR.in]: (rows, keys, node) => (rows / Math.max(1, keys)) * (Array.isArray(node.value) ? node.value.length : 1),
  [OPERATOR.startsWith]: (rows) => rows * 0.15,
  [OPERATOR.endsWith]: (rows) => rows * 0.15,
  [OPERATOR.contains]: (rows) => rows * 0.3,
  [OPERATOR.between]: (rows) => rows * 0.25,
  [OPERATOR.gt]: (rows) => rows * 0.5,
  [OPERATOR.gte]: (rows) => rows * 0.5,
  [OPERATOR.lt]: (rows) => rows * 0.5,
  [OPERATOR.lte]: (rows) => rows * 0.5,
  [OPERATOR.neq]: (rows) => rows * 0.9,
  [OPERATOR.isEmpty]: (rows) => rows * 0.1,
  [OPERATOR.isNotEmpty]: (rows) => rows * 0.9,
};

/** Attach index availability + an estimated row count to every leaf. */
function annotate(node, ctx) {
  if (node instanceof ComparisonNode) {
    const entry = ctx.indexManager.getIndexFor(ctx.objectDef.objectId, node.field.fieldId);
    const usable = Boolean(entry) && entry.def.status === INDEX_STATUS.ACTIVE && entry.strategy.supports(node.operator);
    node.indexed = usable;
    node.indexType = usable ? entry.def.type : null;
    if (!usable) {
      node.estimatedRows = Number.POSITIVE_INFINITY; // always sorts last
      return;
    }
    const keys = entry.strategy.cardinality();
    const estimate = SELECTIVITY[node.operator] || ((rows) => rows * 0.5);
    node.estimatedRows = Math.max(1, Math.round(estimate(ctx.rowCount, keys, node)));
    return;
  }
  for (const child of node.children || []) annotate(child, ctx);
}

function reorder(node) {
  if (node instanceof AndNode) node.children.sort((a, b) => a.estimateCost() - b.estimateCost());
  for (const child of node.children || []) reorder(child);
}

/**
 * Query Optimizer.
 *
 * One rule, applied to every AND: **run the most selective indexed predicate
 * first, and unindexed predicates last.** Intersecting a 40-row set with a
 * 900-row set costs 40 probes; the other order costs 900. Unindexed predicates
 * are pushed to the tail so they only ever filter an already-narrow candidate
 * set instead of the whole object.
 *
 * Selectivity comes from real index statistics — `cardinality()` (distinct key
 * count) combined with a per-operator factor.
 */
export const QueryOptimizer = {
  optimize(node, { indexManager, objectDef, rowCount }) {
    annotate(node, { indexManager, objectDef, rowCount });
    reorder(node);
    return node;
  },
};
