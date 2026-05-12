import { OrderState } from './order-state.interface.js';
import { ORDER_STATUS } from '../../../core/constants/order-status.constants.js';

export class PaidState extends OrderState {
  get name() { return ORDER_STATUS.PAID; }
  get next() { return [ORDER_STATUS.RESTAURANT_ACCEPTED, ORDER_STATUS.CANCELLED]; }
  async handle() { return { ok: true }; }
}
