// Chain-of-Responsibility base. Subclasses implement check(ctx); base wires the chain.
export class BaseBidValidator {
  constructor() {
    this.next = null;
  }

  setNext(validator) {
    this.next = validator;
    return validator; // fluent: chain.setNext(a).setNext(b).setNext(c)
  }

  async validate(ctx) {
    await this.check(ctx);
    if (this.next) await this.next.validate(ctx);
  }

  // override
  async check(_ctx) {
    throw new Error('check() must be implemented by subclass');
  }
}
