/**
 * Payment Strategy interface.
 * pay(amount, details) MUST return { status: 'success'|'failed', transactionId }
 */
export class IPaymentStrategy {
  // eslint-disable-next-line no-unused-vars
  async pay(amount, details) {
    throw new Error('IPaymentStrategy.pay() must be implemented');
  }
}
