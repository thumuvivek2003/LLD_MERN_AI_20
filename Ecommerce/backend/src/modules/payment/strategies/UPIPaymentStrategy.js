import { IPaymentStrategy } from './IPaymentStrategy.js';
import { generateId } from '../../../common/utils/id.util.js';

export class UPIPaymentStrategy extends IPaymentStrategy {
  async pay(_amount, _details) {
    return { status: 'success', transactionId: generateId('UPI') };
  }
}
