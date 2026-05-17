import { couponService } from './coupon.service.js';
import { successResponse } from '../../common/utils/response.util.js';
import { asyncHandler } from '../../common/middlewares/validate.middleware.js';

export const listEligible = asyncHandler(async (req, res) => {
  const coupons = await couponService.listEligibleFor(req.user._id);
  return successResponse(res, { coupons });
});

export const create = asyncHandler(async (req, res) => {
  const coupon = await couponService.createCoupon(req.body);
  return successResponse(res, { coupon }, 201);
});

export const assign = asyncHandler(async (req, res) => {
  const coupon = await couponService.assignCoupon(req.params.id, req.body.userId);
  return successResponse(res, { coupon });
});

export const apply = asyncHandler(async (_req, res) => {
  // Coupon application on cart is handled by cart.routes via cart.service.applyCoupon.
  return successResponse(res, { ok: true });
});
