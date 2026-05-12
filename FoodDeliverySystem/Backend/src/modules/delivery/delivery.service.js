import { deliveryRepository } from './delivery.repository.js';
import { orderService } from '../orders/order.service.js';
import { orderRepository } from '../orders/order.repository.js';
import { NotFoundError } from '../../core/errors/not-found.error.js';
import { BadRequestError } from '../../core/errors/bad-request.error.js';
import { ORDER_STATUS } from '../../core/constants/order-status.constants.js';
import { USER_ROLES } from '../../core/constants/roles.constants.js';
import { toOrderDtoList } from '../orders/order.mapper.js';

class DeliveryService {
  async getOrCreateProfile(userId, name) {
    let p = await deliveryRepository.findByUserId(userId);
    if (!p) p = await deliveryRepository.create({ userId, name });
    return p;
  }

  async acceptDelivery(userId, orderId) {
    const partner = await deliveryRepository.findByUserId(userId);
    if (!partner) throw new NotFoundError('Delivery profile not found');
    const order = await orderRepository.findById(orderId);
    if (!order) throw new NotFoundError('Order not found');
    if (order.deliveryPartnerId?.toString() !== partner._id.toString()) {
      throw new BadRequestError('Order is not assigned to you');
    }
    return orderService.transitionOrderState(orderId, ORDER_STATUS.OUT_FOR_DELIVERY, {
      id: userId, role: USER_ROLES.DELIVERY_PARTNER, deliveryPartnerId: partner._id,
    });
  }

  async rejectDelivery(userId, orderId) {
    const partner = await deliveryRepository.findByUserId(userId);
    if (!partner) throw new NotFoundError('Delivery profile not found');
    const order = await orderRepository.findById(orderId);
    if (!order) throw new NotFoundError('Order not found');
    if (order.deliveryPartnerId?.toString() !== partner._id.toString()) {
      throw new BadRequestError('Order is not assigned to you');
    }
    order.deliveryPartnerId = null;
    await order.save();
    return { ok: true };
  }

  async verifyDeliveryOtp(userId, orderId, otp) {
    const partner = await deliveryRepository.findByUserId(userId);
    if (!partner) throw new NotFoundError('Delivery profile not found');
    return orderService.verifyDeliveryOtp(orderId, otp, partner._id);
  }

  async getMyOrders(userId, status) {
    const partner = await deliveryRepository.findByUserId(userId);
    if (!partner) return [];
    const filter = status ? { status } : {};
    const list = await orderRepository.findOrdersByDeliveryPartner(partner._id, filter);
    return toOrderDtoList(list);
  }

  async setAvailability(userId, status) {
    const partner = await deliveryRepository.findByUserId(userId);
    if (!partner) throw new NotFoundError('Delivery profile not found');
    partner.status = status;
    await partner.save();
    return partner;
  }
}

export const deliveryService = new DeliveryService();
