import { OrderState } from './order-state.interface.js';
import { ORDER_STATUS } from '../../../core/constants/order-status.constants.js';

export class ReadyForPickupState extends OrderState {
  get name() { return ORDER_STATUS.READY_FOR_PICKUP; }
  get next() { return [ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.CANCELLED]; }
  async handle() { return { ok: true }; }
}
