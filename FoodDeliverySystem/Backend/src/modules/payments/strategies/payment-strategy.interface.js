export class PaymentStrategy {
  async pay(_context) {
    throw new Error('pay() must be implemented by subclass');
  }
}
