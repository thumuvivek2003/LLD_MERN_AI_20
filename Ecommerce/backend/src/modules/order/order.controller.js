import { orderService } from './order.service.js';
import { successResponse } from '../../common/utils/response.util.js';
import { asyncHandler } from '../../common/middlewares/validate.middleware.js';

export const getAll = asyncHandler(async (req, res) => {
  const orders = await orderService.getOrders(req.user._id);
  return successResponse(res, { orders });
});

export const getById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user._id);
  return successResponse(res, { order });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateStatus(req.params.id, req.body.status);
  return successResponse(res, { order });
});

export const create = asyncHandler(async (_req, res) => {
  // Orders are created through checkout.facade; expose only for completeness.
  return successResponse(res, { ok: true });
});
