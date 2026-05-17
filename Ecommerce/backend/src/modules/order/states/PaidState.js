import { IOrderState } from './IOrderState.js';
import { ORDER_STATUS } from '../../../common/constants/orderStatus.constants.js';

export class PaidState extends IOrderState {
  ship(_order) {
    return ORDER_STATUS.SHIPPED;
  }
  cancel(_order) {
    return ORDER_STATUS.CANCELLED;
  }
}
