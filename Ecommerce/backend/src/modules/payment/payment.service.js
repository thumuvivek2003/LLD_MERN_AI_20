import { PaymentStrategyFactory } from './factories/PaymentStrategyFactory.js';
import { PaymentGatewaySingleton } from './PaymentGatewaySingleton.js';

export class PaymentService {
  constructor() {
    this.gateway = PaymentGatewaySingleton.getInstance();
  }

  async processPayment(type, amount, details = {}) {
    const strategy = PaymentStrategyFactory.create(type);
    return this.gateway.charge(strategy, amount, details);
  }
}

export const paymentService = new PaymentService();
