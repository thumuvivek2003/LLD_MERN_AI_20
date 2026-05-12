export class OrderState {
  get name() { throw new Error('name must be defined'); }
  get next() { return []; }

  canTransitionTo(nextStatus) {
    return this.next.includes(nextStatus);
  }

  async handle(_context) {
    throw new Error('handle() must be implemented');
  }
}
