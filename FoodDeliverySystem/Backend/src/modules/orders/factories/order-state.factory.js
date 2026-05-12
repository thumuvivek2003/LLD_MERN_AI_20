import { ORDER_STATUS } from '../../../core/constants/order-status.constants.js';
import { CreatedState } from '../states/created.state.js';
import { PaidState } from '../states/paid.state.js';
import { AcceptedState } from '../states/accepted.state.js';
import { PreparingState } from '../states/preparing.state.js';
import { ReadyForPickupState } from '../states/ready-for-pickup.state.js';
import { OutForDeliveryState } from '../states/out-for-delivery.state.js';
import { DeliveredState } from '../states/delivered.state.js';
import { CancelledState } from '../states/cancelled.state.js';
import { BadRequestError } from '../../../core/errors/bad-request.error.js';

const registry = {
  [ORDER_STATUS.CREATED]: new CreatedState(),
  [ORDER_STATUS.PAID]: new PaidState(),
  [ORDER_STATUS.RESTAURANT_ACCEPTED]: new AcceptedState(),
  [ORDER_STATUS.PREPARING]: new PreparingState(),
  [ORDER_STATUS.READY_FOR_PICKUP]: new ReadyForPickupState(),
  [ORDER_STATUS.OUT_FOR_DELIVERY]: new OutForDeliveryState(),
  [ORDER_STATUS.DELIVERED]: new DeliveredState(),
  [ORDER_STATUS.CANCELLED]: new CancelledState(),
};

export const getOrderStateHandler = (status) => {
  const handler = registry[status];
  if (!handler) throw new BadRequestError(`Unknown order status: ${status}`);
  return handler;
};
