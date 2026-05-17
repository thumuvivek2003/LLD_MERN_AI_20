/**
 * Acts as the single connection point to a simulated payment gateway.
 * Real systems would keep one SDK client; we wrap strategy dispatch here.
 */
class PaymentGateway {
  constructor() {
    this.connectedAt = new Date();
  }

  async charge(strategy, amount, details) {
    return strategy.pay(amount, details);
  }
}

let instance = null;

export const PaymentGatewaySingleton = {
  getInstance() {
    if (!instance) instance = new PaymentGateway();
    return instance;
  },
};
