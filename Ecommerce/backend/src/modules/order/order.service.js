import { orderRepository } from './order.repository.js';
import { OrderBuilder } from './builder/OrderBuilder.js';
import { CreatedState } from './states/CreatedState.js';
import { PaidState } from './states/PaidState.js';
import { ShippedState } from './states/ShippedState.js';
import { DeliveredState } from './states/DeliveredState.js';
import { CancelledState } from './states/CancelledState.js';
import { ORDER_STATUS, ORDER_ACTIONS } from '../../common/constants/orderStatus.constants.js';
import { NotFoundError } from '../../common/errors/NotFoundError.js';
import { ValidationError } from '../../common/errors/ValidationError.js';

// status -> state instance lookup. Adding a new state means one map entry, not new if-elses.
const STATE_MAP = {
  [ORDER_STATUS.CREATED]: new CreatedState(),
  [ORDER_STATUS.PAID]: new PaidState(),
  [ORDER_STATUS.SHIPPED]: new ShippedState(),
  [ORDER_STATUS.DELIVERED]: new DeliveredState(),
  [ORDER_STATUS.CANCELLED]: new CancelledState(),
};

export class OrderService {
  constructor(repo = orderRepository) {
    this.repo = repo;
  }

  builder() {
    return new OrderBuilder();
  }

  createOrder(payload) {
    return this.repo.create(payload);
  }

  async getOrders(userId) {
    return this.repo.findForUser(userId);
  }

  async getAllOrders() {
    return this.repo.findAllAll();
  }

  async getOrderById(id, userId = null) {
    const order = await this.repo.findById(id);
    if (!order) throw new NotFoundError('Order not found');
    if (userId && String(order.userId) !== String(userId)) {
      throw new NotFoundError('Order not found');
    }
    return order;
  }

  /**
   * Delegates the transition to the current State object.
   * action ∈ { confirm, ship, deliver, cancel }
   */
  async transitionTo(orderId, action) {
    const order = await this.repo.findById(orderId);
    if (!order) throw new NotFoundError('Order not found');
    const state = STATE_MAP[order.status];
    if (!state) throw new ValidationError(`Unknown order status: ${order.status}`);
    if (typeof state[action] !== 'function') {
      throw new ValidationError(`Unknown action: ${action}`, 'INVALID_ACTION');
    }
    const nextStatus = state[action](order);
    order.status = nextStatus;
    await order.save();
    return order;
  }

  async updateStatus(orderId, targetStatus) {
    const order = await this.repo.findById(orderId);
    if (!order) throw new NotFoundError('Order not found');
    const action = this._statusToAction(order.status, targetStatus);
    return this.transitionTo(orderId, action);
  }

  _statusToAction(from, to) {
    if (from === ORDER_STATUS.CREATED && to === ORDER_STATUS.PAID) return ORDER_ACTIONS.CONFIRM;
    if (from === ORDER_STATUS.PAID && to === ORDER_STATUS.SHIPPED) return ORDER_ACTIONS.SHIP;
    if (from === ORDER_STATUS.SHIPPED && to === ORDER_STATUS.DELIVERED) return ORDER_ACTIONS.DELIVER;
    if ((from === ORDER_STATUS.CREATED || from === ORDER_STATUS.PAID) && to === ORDER_STATUS.CANCELLED) {
      return ORDER_ACTIONS.CANCEL;
    }
    throw new ValidationError(`Illegal transition: ${from} -> ${to}`, 'INVALID_TRANSITION');
  }
}

export const orderService = new OrderService();
