import { OrderState } from './order-state.interface.js';
import { ORDER_STATUS } from '../../../core/constants/order-status.constants.js';

export class PreparingState extends OrderState {
  get name() { return ORDER_STATUS.PREPARING; }
  get next() { return [ORDER_STATUS.READY_FOR_PICKUP, ORDER_STATUS.CANCELLED]; }
  async handle() { return { ok: true }; }
}
