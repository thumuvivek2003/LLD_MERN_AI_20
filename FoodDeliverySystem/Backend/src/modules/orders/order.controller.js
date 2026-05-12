import { orderService } from './order.service.js';
import { successResponse } from '../../core/utils/response.util.js';
import { deliveryRepository } from '../delivery/delivery.repository.js';
import { USER_ROLES } from '../../core/constants/roles.constants.js';

const resolveActor = async (user) => {
  if (user.role === USER_ROLES.DELIVERY_PARTNER) {
    const partner = await deliveryRepository.findByUserId(user.id);
    return { id: user.id, role: user.role, deliveryPartnerId: partner?._id };
  }
  return { id: user.id, role: user.role };
};

export const placeOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user.id, req.body);
    successResponse(res, order, 'Order placed', 201);
  } catch (err) { next(err); }
};

export const getOrderDetails = async (req, res, next) => {
  try {
    const actor = await resolveActor(req.user);
    const order = await orderService.getOrderById(req.params.id, actor);
    successResponse(res, order);
  } catch (err) { next(err); }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const actor = await resolveActor(req.user);
    const order = await orderService.transitionOrderState(req.params.id, req.body.status, actor);
    successResponse(res, order, 'Status updated');
  } catch (err) { next(err); }
};

export const getOrderHistory = async (req, res, next) => {
  try {
    const list = await orderService.getCustomerOrders(req.user.id);
    successResponse(res, list);
  } catch (err) { next(err); }
};

export const getRestaurantOrders = async (req, res, next) => {
  try {
    const list = await orderService.getRestaurantOrders(req.params.restaurantId, req.query.status);
    successResponse(res, list);
  } catch (err) { next(err); }
};

export const assignDelivery = async (req, res, next) => {
  try {
    const order = await orderService.assignDeliveryPartner(req.params.id, req.body.strategy);
    successResponse(res, order, 'Partner assigned');
  } catch (err) { next(err); }
};
