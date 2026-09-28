/**
 * Composite base for the filter expression tree.
 *
 *   AndNode ── OrNode ── ComparisonNode (leaf)
 *
 * `execute(ctx)` returns either a Set of record ids (this branch was answered
 * by the index layer) or `null`, meaning "unconstrained — I could not be
 * index-served, a residual filter has been registered instead".
 *
 * That single nullable return is what lets an unindexed predicate coexist with
 * indexed ones inside one tree without any node knowing about the others.
 */
export class ExpressionNode {
  get kind() {
    return this.constructor.name;
  }

  /** Estimated matching rows; the optimizer orders siblings by this. */
  estimateCost() {
    return Number.POSITIVE_INFINITY;
  }

  async execute(_ctx) {
    throw new Error('ExpressionNode.execute must be implemented');
  }

  explain() {
    return { kind: this.kind };
  }
}

export const intersect = (a, b) => {
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  const out = new Set();
  for (const id of small) if (large.has(id)) out.add(id);
  return out;
};

export const union = (a, b) => {
  const out = new Set(a);
  for (const id of b) out.add(id);
  return out;
};
