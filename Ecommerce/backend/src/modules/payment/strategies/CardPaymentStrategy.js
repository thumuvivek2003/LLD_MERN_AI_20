import { IPaymentStrategy } from './IPaymentStrategy.js';
import { generateId } from '../../../common/utils/id.util.js';

export class CardPaymentStrategy extends IPaymentStrategy {
  async pay(_amount, details = {}) {
    // Simulated failure path: a sentinel "all-zero" card number
    if (details.card === '0000000000000000') {
      return { status: 'failed', transactionId: generateId('CARD') };
    }
    return { status: 'success', transactionId: generateId('CARD') };
  }
}
