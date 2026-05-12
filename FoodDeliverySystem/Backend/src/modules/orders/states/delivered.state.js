import { OrderState } from './order-state.interface.js';
import { ORDER_STATUS } from '../../../core/constants/order-status.constants.js';

export class DeliveredState extends OrderState {
  get name() { return ORDER_STATUS.DELIVERED; }
  get next() { return []; }
  async handle() { return { ok: true, terminal: true }; }
}
