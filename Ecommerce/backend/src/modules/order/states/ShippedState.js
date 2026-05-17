import { IOrderState } from './IOrderState.js';
import { ORDER_STATUS } from '../../../common/constants/orderStatus.constants.js';

export class ShippedState extends IOrderState {
  deliver(_order) {
    return ORDER_STATUS.DELIVERED;
  }
}
