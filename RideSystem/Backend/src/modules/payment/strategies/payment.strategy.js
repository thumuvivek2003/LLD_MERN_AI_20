export class PaymentStrategy {
  constructor(method) {
    this.method = method;
  }
  // eslint-disable-next-line no-unused-vars
  async process(_payment) {
    throw new Error('process() not implemented');
  }
}
