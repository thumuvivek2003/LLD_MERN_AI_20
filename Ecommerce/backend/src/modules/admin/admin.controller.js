import { adminService } from './admin.service.js';
import { successResponse } from '../../common/utils/response.util.js';
import { asyncHandler } from '../../common/middlewares/validate.middleware.js';

// stats
export const getStats = asyncHandler(async (_req, res) => {
  const stats = await adminService.getStats();
  return successResponse(res, { stats });
});

// users
export const listUsers = asyncHandler(async (_req, res) => {
  const users = await adminService.getAllUsers();
  return successResponse(res, { users });
});

export const getUserDetails = asyncHandler(async (req, res) => {
  const { user, orders, assignedCoupons } = await adminService.getUserDetails(req.params.id);
  return successResponse(res, { user, orders, assignedCoupons });
});

export const blockUser = asyncHandler(async (req, res) => {
  const user = await adminService.blockUser(req.params.id);
  return successResponse(res, { user });
});

export const unblockUser = asyncHandler(async (req, res) => {
  const user = await adminService.unblockUser(req.params.id);
  return successResponse(res, { user });
});

// coupons
export const listCoupons = asyncHandler(async (_req, res) => {
  const coupons = await adminService.getAllCoupons();
  return successResponse(res, { coupons });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await adminService.createCoupon(req.body);
  return successResponse(res, { coupon }, 201);
});

export const toggleCoupon = asyncHandler(async (req, res) => {
  const coupon = await adminService.toggleCoupon(req.params.id);
  return successResponse(res, { coupon });
});

export const assignCoupon = asyncHandler(async (req, res) => {
  const coupon = await adminService.assignCoupon(req.params.id, req.body.userId);
  return successResponse(res, { coupon });
});

export const getCouponDetails = asyncHandler(async (req, res) => {
  const { coupon, assignedUsers } = await adminService.getCouponDetails(req.params.id);
  return successResponse(res, { coupon, assignedUsers });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await adminService.updateCoupon(req.params.id, req.body);
  return successResponse(res, { coupon });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  await adminService.deleteCoupon(req.params.id);
  return successResponse(res, { deleted: true });
});

export const unassignCoupon = asyncHandler(async (req, res) => {
  const coupon = await adminService.unassignCoupon(req.params.id, req.params.userId);
  return successResponse(res, { coupon });
});

// orders
export const listOrders = asyncHandler(async (_req, res) => {
  const orders = await adminService.getAllOrders();
  return successResponse(res, { orders });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await adminService.updateOrderStatus(req.params.id, req.body.status);
  return successResponse(res, { order });
});

export const getOrderDetails = asyncHandler(async (req, res) => {
  const { order, customer } = await adminService.getOrderDetails(req.params.id);
  return successResponse(res, { order, customer });
});
