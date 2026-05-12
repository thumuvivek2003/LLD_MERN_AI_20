import { deliveryService } from './delivery.service.js';
import { deliveryRepository } from './delivery.repository.js';
import { successResponse } from '../../core/utils/response.util.js';

export const getProfile = async (req, res, next) => {
  try {
    const p = await deliveryService.getOrCreateProfile(req.user.id, req.user.email);
    successResponse(res, p);
  } catch (err) { next(err); }
};

export const setAvailability = async (req, res, next) => {
  try {
    const p = await deliveryService.setAvailability(req.user.id, req.body.status);
    successResponse(res, p, 'Updated');
  } catch (err) { next(err); }
};

export const acceptDelivery = async (req, res, next) => {
  try {
    const order = await deliveryService.acceptDelivery(req.user.id, req.params.orderId);
    successResponse(res, order, 'Accepted');
  } catch (err) { next(err); }
};

export const rejectDelivery = async (req, res, next) => {
  try {
    const r = await deliveryService.rejectDelivery(req.user.id, req.params.orderId);
    successResponse(res, r, 'Rejected');
  } catch (err) { next(err); }
};

export const verifyDeliveryOtp = async (req, res, next) => {
  try {
    const order = await deliveryService.verifyDeliveryOtp(req.user.id, req.params.orderId, req.body.otp);
    successResponse(res, order, 'Delivered');
  } catch (err) { next(err); }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const list = await deliveryService.getMyOrders(req.user.id, req.query.status);
    successResponse(res, list);
  } catch (err) { next(err); }
};

export const listAllPartners = async (_req, res, next) => {
  try {
    const list = await deliveryRepository.findAll();
    successResponse(res, list);
  } catch (err) { next(err); }
};
