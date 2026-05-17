import { IOrderState } from './IOrderState.js';
import { ORDER_STATUS } from '../../../common/constants/orderStatus.constants.js';

export class CreatedState extends IOrderState {
  confirm(_order) {
    return ORDER_STATUS.PAID;
  }
  cancel(_order) {
    return ORDER_STATUS.CANCELLED;
  }
}
