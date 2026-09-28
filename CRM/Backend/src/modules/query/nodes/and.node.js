import { ExpressionNode, intersect } from './expression.node.js';

/** Composite: intersects its children's id sets, cheapest child first. */
export class AndNode extends ExpressionNode {
  constructor(children = []) {
    super();
    this.children = children;
  }

  estimateCost() {
    return Math.min(...this.children.map((c) => c.estimateCost()), Number.POSITIVE_INFINITY);
  }

  async execute(ctx) {
    let acc = null;
    for (const child of this.children) {
      const ids = await child.execute(ctx);
      if (ids === null) continue; // unconstrained child — residual filter handles it
      acc = acc === null ? ids : intersect(acc, ids);
      if (acc.size === 0) break; // short-circuit: nothing can survive
    }
    if (acc !== null && this.children.length > 1) {
      ctx.plan.steps.push({ op: 'INTERSECT', matched: acc.size });
    }
    return acc;
  }

  explain() {
    return { kind: 'AND', children: this.children.map((c) => c.explain()) };
  }
}
