import { OrderState } from './order-state.interface.js';
import { ORDER_STATUS } from '../../../core/constants/order-status.constants.js';

export class OutForDeliveryState extends OrderState {
  get name() { return ORDER_STATUS.OUT_FOR_DELIVERY; }
  get next() { return [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED]; }
  async handle() { return { ok: true }; }
}
