/**
 * Chain of Responsibility — each step has process(context, next).
 * Steps are wired in PricingService; PricingPipeline only orchestrates traversal.
 */
export class PricingPipeline {
  constructor(steps = []) {
    this.steps = steps;
  }

  add(step) {
    this.steps.push(step);
    return this;
  }

  execute(context) {
    const run = (index) => {
      if (index >= this.steps.length) return context;
      const step = this.steps[index];
      step.process(context, () => run(index + 1));
      return context;
    };
    return run(0);
  }
}
