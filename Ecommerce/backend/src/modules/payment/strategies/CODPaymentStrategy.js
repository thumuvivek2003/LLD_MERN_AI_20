import { IPaymentStrategy } from './IPaymentStrategy.js';
import { generateId } from '../../../common/utils/id.util.js';

export class CODPaymentStrategy extends IPaymentStrategy {
  async pay(_amount, _details) {
    // COD is "success" at order-time (collected on delivery)
    return { status: 'success', transactionId: generateId('COD') };
  }
}
