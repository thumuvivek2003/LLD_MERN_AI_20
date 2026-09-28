import { ExpressionNode, union } from './expression.node.js';

/**
 * Composite: unions its children's id sets.
 *
 * An OR is only index-servable if *every* branch is. One unindexed branch makes
 * the whole disjunction unconstrained, so the node discards the partial index
 * work and registers a combined residual predicate instead — otherwise it would
 * silently drop matching records.
 */
export class OrNode extends ExpressionNode {
  constructor(children = []) {
    super();
    this.children = children;
  }

  estimateCost() {
    return this.children.reduce((sum, c) => sum + c.estimateCost(), 0);
  }

  async execute(ctx) {
    const results = [];
    const before = ctx.residuals.length;
    for (const child of this.children) results.push(await child.execute(ctx));

    if (results.some((r) => r === null)) {
      const branchPredicates = this.children.map((c) => c.toPredicate?.()).filter(Boolean);
      ctx.residuals.length = before;
      ctx.residuals.push((recordJson) => branchPredicates.some((p) => p(recordJson)));
      ctx.plan.steps.push({ op: 'UNION', matched: null, mode: 'RESIDUAL_FILTER' });
      return null;
    }

    const acc = results.reduce((a, b) => union(a, b), new Set());
    ctx.unionOps += 1;
    ctx.plan.steps.push({ op: 'UNION', matched: acc.size });
    return acc;
  }

  explain() {
    return { kind: 'OR', children: this.children.map((c) => c.explain()) };
  }
}
