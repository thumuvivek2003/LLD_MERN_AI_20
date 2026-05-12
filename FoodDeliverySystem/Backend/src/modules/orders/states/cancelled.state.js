import { OrderState } from './order-state.interface.js';
import { ORDER_STATUS } from '../../../core/constants/order-status.constants.js';

export class CancelledState extends OrderState {
  get name() { return ORDER_STATUS.CANCELLED; }
  get next() { return []; }
  async handle() { return { ok: true, terminal: true }; }
}
