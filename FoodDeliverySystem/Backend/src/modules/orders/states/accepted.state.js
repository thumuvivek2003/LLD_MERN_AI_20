import { OrderState } from './order-state.interface.js';
import { ORDER_STATUS } from '../../../core/constants/order-status.constants.js';

export class AcceptedState extends OrderState {
  get name() { return ORDER_STATUS.RESTAURANT_ACCEPTED; }
  get next() { return [ORDER_STATUS.PREPARING, ORDER_STATUS.CANCELLED]; }
  async handle() { return { ok: true }; }
}
