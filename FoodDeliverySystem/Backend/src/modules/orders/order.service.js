import { orderRepository } from './order.repository.js';
import { cartRepository } from '../carts/cart.repository.js';
import { restaurantRepository } from '../restaurants/restaurant.repository.js';
import { userRepository } from '../users/user.repository.js';
import { paymentService } from '../payments/payment.service.js';
import { deliveryRepository } from '../delivery/delivery.repository.js';
import { getAssignmentStrategy } from '../delivery/factories/delivery-strategy.factory.js';
import { getOrderStateHandler } from './factories/order-state.factory.js';
import { toOrderDto, toOrderDtoList } from './order.mapper.js';
import { BadRequestError } from '../../core/errors/bad-request.error.js';
import { NotFoundError } from '../../core/errors/not-found.error.js';
import { ForbiddenError } from '../../core/errors/unauthorized.error.js';
import { ORDER_STATUS } from '../../core/constants/order-status.constants.js';
import { PAYMENT_STATUS } from '../../core/constants/payment.constants.js';
import { DELIVERY_STATUS, DELIVERY_ASSIGNMENT_TYPES } from '../../core/constants/delivery.constants.js';
import { USER_ROLES } from '../../core/constants/roles.constants.js';
import { eventBus, EVENTS } from '../notifications/event-bus.js';
import { generateOtp } from '../../core/utils/otp.util.js';

class OrderService {
  async createOrder(customerId, { paymentMethod, deliveryAddress }) {
    const cart = await cartRepository.findCartByUserId(customerId);
    if (!cart || !cart.items.length) throw new BadRequestError('Cart is empty');

    const customer = await userRepository.findById(customerId);
    if (!customer) throw new NotFoundError('Customer not found');

    const totalAmount = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);

    const order = await orderRepository.create({
      customerId,
      restaurantId: cart.restaurantId,
      items: cart.items.map((i) => ({
        menuItemId: i.menuItemId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      totalAmount,
      paymentMethod,
      deliveryAddress: deliveryAddress || customer.address || 'N/A',
      status: ORDER_STATUS.CREATED,
      statusHistory: [{ status: ORDER_STATUS.CREATED, at: new Date() }],
    });

    const payment = await paymentService.processPayment({
      orderId: order._id,
      userId: customerId,
      amount: totalAmount,
      method: paymentMethod,
      customer,
    });
    order.paymentId = payment._id;

    if (payment.status === PAYMENT_STATUS.SUCCESS || payment.method === 'COD') {
      order.status = ORDER_STATUS.PAID;
      order.statusHistory.push({ status: ORDER_STATUS.PAID, at: new Date() });
    }
    await order.save();

    cart.items = [];
    cart.restaurantId = null;
    await cart.save();

    eventBus.publish(EVENTS.ORDER_CREATED, { order: toOrderDto(order), customer });
    return toOrderDto(order);
  }

  async transitionOrderState(orderId, nextStatus, actor) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new NotFoundError('Order not found');

    const current = getOrderStateHandler(order.status);
    if (!current.canTransitionTo(nextStatus)) {
      throw new BadRequestError(`Cannot transition ${order.status} → ${nextStatus}`);
    }

    this.#authorizeTransition(order, nextStatus, actor);

    if (nextStatus === ORDER_STATUS.OUT_FOR_DELIVERY && !order.deliveryOtp) {
      order.deliveryOtp = generateOtp(4);
      const customer = await userRepository.findById(order.customerId);
      eventBus.publish(EVENTS.OTP_GENERATED, { user: customer, otp: order.deliveryOtp });
    }

    order.status = nextStatus;
    order.statusHistory.push({ status: nextStatus, at: new Date() });
    await order.save();

    if (nextStatus === ORDER_STATUS.DELIVERED) {
      const customer = await userRepository.findById(order.customerId);
      eventBus.publish(EVENTS.ORDER_DELIVERED, { order: toOrderDto(order), customer });
      if (order.deliveryPartnerId) {
        const partner = await deliveryRepository.findById(order.deliveryPartnerId);
        if (partner) {
          partner.status = DELIVERY_STATUS.AVAILABLE;
          partner.earnings += Math.round(order.totalAmount * 0.1);
          partner.completedCount += 1;
          await partner.save();
        }
      }
    }
    return toOrderDto(order);
  }

  async assignDeliveryPartner(orderId, strategyType = DELIVERY_ASSIGNMENT_TYPES.NEAREST) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new NotFoundError('Order not found');
    if (order.deliveryPartnerId) throw new BadRequestError('Already assigned');

    const restaurant = await restaurantRepository.findById(order.restaurantId);
    if (!restaurant) throw new NotFoundError('Restaurant not found');

    const partners = await deliveryRepository.findAvailablePartners();
    if (!partners.length) throw new BadRequestError('No delivery partners available');

    const strategy = getAssignmentStrategy(strategyType);
    const chosen = await strategy.assign({ partners, restaurant });
    if (!chosen) throw new BadRequestError('No suitable partner');

    order.deliveryPartnerId = chosen._id;
    await order.save();

    chosen.status = DELIVERY_STATUS.BUSY;
    await chosen.save();

    return toOrderDto(order);
  }

  async getOrderById(orderId, actor) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new NotFoundError('Order not found');
    this.#authorizeRead(order, actor);
    return toOrderDto(order);
  }

  async getCustomerOrders(customerId) {
    const list = await orderRepository.findOrdersByUser(customerId);
    return toOrderDtoList(list);
  }

  async getRestaurantOrders(restaurantId, status) {
    const filter = status ? { status } : {};
    const list = await orderRepository.findOrdersByRestaurant(restaurantId, filter);
    return toOrderDtoList(list);
  }

  async getDeliveryOrders(deliveryPartnerId, status) {
    const filter = status ? { status } : {};
    const list = await orderRepository.findOrdersByDeliveryPartner(deliveryPartnerId, filter);
    return toOrderDtoList(list);
  }

  async verifyDeliveryOtp(orderId, otp, deliveryPartnerId) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new NotFoundError('Order not found');
    if (order.deliveryPartnerId?.toString() !== deliveryPartnerId.toString()) {
      throw new ForbiddenError('Not your assigned order');
    }
    if (!order.deliveryOtp || order.deliveryOtp !== otp) {
      throw new BadRequestError('Invalid OTP');
    }
    return this.transitionOrderState(orderId, ORDER_STATUS.DELIVERED, {
      role: USER_ROLES.DELIVERY_PARTNER,
      deliveryPartnerId,
    });
  }

  #authorizeTransition(order, nextStatus, actor) {
    const customerTransitions = [ORDER_STATUS.CANCELLED];
    const restaurantTransitions = [
      ORDER_STATUS.RESTAURANT_ACCEPTED,
      ORDER_STATUS.PREPARING,
      ORDER_STATUS.READY_FOR_PICKUP,
      ORDER_STATUS.CANCELLED,
    ];
    const deliveryTransitions = [ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.DELIVERED];

    if (actor.role === USER_ROLES.CUSTOMER) {
      if (!customerTransitions.includes(nextStatus)) {
        throw new ForbiddenError('Customer cannot perform this transition');
      }
      if (order.customerId.toString() !== actor.id) throw new ForbiddenError('Not your order');
      return;
    }
    if (actor.role === USER_ROLES.RESTAURANT_ADMIN) {
      if (!restaurantTransitions.includes(nextStatus)) {
        throw new ForbiddenError('Restaurant cannot perform this transition');
      }
      return;
    }
    if (actor.role === USER_ROLES.DELIVERY_PARTNER) {
      if (!deliveryTransitions.includes(nextStatus)) {
        throw new ForbiddenError('Delivery partner cannot perform this transition');
      }
      if (
        actor.deliveryPartnerId &&
        order.deliveryPartnerId?.toString() !== actor.deliveryPartnerId.toString()
      ) {
        throw new ForbiddenError('Not your assigned order');
      }
      return;
    }
    if (actor.role !== USER_ROLES.SYSTEM_ADMIN) throw new ForbiddenError('Forbidden');
  }

  #authorizeRead(order, actor) {
    if (actor.role === USER_ROLES.SYSTEM_ADMIN) return;
    if (actor.role === USER_ROLES.CUSTOMER && order.customerId.toString() === actor.id) return;
    if (actor.role === USER_ROLES.RESTAURANT_ADMIN) return;
    if (
      actor.role === USER_ROLES.DELIVERY_PARTNER &&
      order.deliveryPartnerId?.toString() === actor.deliveryPartnerId?.toString()
    )
      return;
    throw new ForbiddenError('Cannot view this order');
  }
}

export const orderService = new OrderService();
