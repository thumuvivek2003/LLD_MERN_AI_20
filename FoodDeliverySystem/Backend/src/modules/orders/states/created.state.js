import { OrderState } from './order-state.interface.js';
import { ORDER_STATUS } from '../../../core/constants/order-status.constants.js';

export class CreatedState extends OrderState {
  get name() { return ORDER_STATUS.CREATED; }
  get next() { return [ORDER_STATUS.PAID, ORDER_STATUS.CANCELLED]; }
  async handle() { return { ok: true }; }
}
