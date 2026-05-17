import { cartService } from './cart.service.js';
import { successResponse } from '../../common/utils/response.util.js';
import { asyncHandler } from '../../common/middlewares/validate.middleware.js';

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user._id);
  return successResponse(res, { cart });
});

export const addItem = asyncHandler(async (req, res) => {
  const cart = await cartService.addItem(req.user._id, req.body);
  return successResponse(res, { cart });
});

export const updateQty = asyncHandler(async (req, res) => {
  const cart = await cartService.updateQuantity(req.user._id, req.params.productId, req.body.quantity);
  return successResponse(res, { cart });
});

export const removeItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeItem(req.user._id, req.params.productId);
  return successResponse(res, { cart });
});

export const applyCoupon = asyncHandler(async (req, res) => {
  const cart = await cartService.applyCoupon(req.user._id, req.body.code);
  return successResponse(res, { cart });
});

export const removeCoupon = asyncHandler(async (req, res) => {
  const cart = await cartService.removeCoupon(req.user._id);
  return successResponse(res, { cart });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.user._id);
  return successResponse(res, { cart });
});
