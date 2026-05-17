import { userService } from '../user/user.service.js';
import { couponService } from '../coupon/coupon.service.js';
import { orderService } from '../order/order.service.js';
import { userRepository } from '../user/user.repository.js';
import { couponRepository } from '../coupon/coupon.repository.js';
import { orderRepository } from '../order/order.repository.js';
import { NotFoundError } from '../../common/errors/NotFoundError.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { ORDER_STATUS } from '../../common/constants/orderStatus.constants.js';
import { COUPON_TYPE } from '../../common/constants/couponType.constants.js';

export class AdminService {
  constructor({
    userRepo = userRepository,
    couponRepo = couponRepository,
    orderRepo = orderRepository,
  } = {}) {
    this.userRepo = userRepo;
    this.couponRepo = couponRepo;
    this.orderRepo = orderRepo;
  }

  // Users
  getAllUsers() {
    return userService.listAll();
  }
  blockUser(id) {
    return userService.blockUser(id);
  }
  unblockUser(id) {
    return userService.unblockUser(id);
  }

  async getUserDetails(userId) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    const orders = await this.orderRepo.find({ userId }, { sort: { createdAt: -1 } });
    const assignedCoupons = await this.couponRepo.findAssignedTo(userId);
    return { user: user.toSafeJSON(), orders, assignedCoupons };
  }

  // Coupons
  getAllCoupons() {
    return couponService.listAll();
  }
  createCoupon(payload) {
    return couponService.createCoupon(payload);
  }
  toggleCoupon(id) {
    return couponService.toggleCoupon(id);
  }
  assignCoupon(id, userId) {
    return couponService.assignCoupon(id, userId);
  }

  async getCouponDetails(couponId) {
    const coupon = await this.couponRepo.findById(couponId);
    if (!coupon) throw new NotFoundError('Coupon not found');
    const users = await this.userRepo.model.find({ _id: { $in: coupon.assignedUserIds } });
    const assignedUsers = users.map((u) => u.toSafeJSON());
    return { coupon, assignedUsers };
  }

  async updateCoupon(id, payload = {}) {
    const { code, ...rest } = payload;
    const sanitized = {};
    if (rest.type !== undefined) {
      if (!Object.values(COUPON_TYPE).includes(rest.type)) {
        throw new ValidationError('Invalid coupon type');
      }
      sanitized.type = rest.type;
    }
    if (rest.value !== undefined) {
      if (typeof rest.value !== 'number' || rest.value < 0) {
        throw new ValidationError('value must be a non-negative number');
      }
      sanitized.value = rest.value;
    }
    if (rest.minCartValue !== undefined) {
      if (typeof rest.minCartValue !== 'number' || rest.minCartValue < 0) {
        throw new ValidationError('minCartValue must be a non-negative number');
      }
      sanitized.minCartValue = rest.minCartValue;
    }
    if (rest.description !== undefined) sanitized.description = rest.description;
    if (rest.active !== undefined) sanitized.active = !!rest.active;

    const coupon = await this.couponRepo.update(id, sanitized);
    if (!coupon) throw new NotFoundError('Coupon not found');
    return coupon;
  }

  async deleteCoupon(id) {
    const deleted = await this.couponRepo.delete(id);
    if (!deleted) throw new NotFoundError('Coupon not found');
    return deleted;
  }

  async unassignCoupon(couponId, userId) {
    const coupon = await this.couponRepo.unassignUser(couponId, userId);
    if (!coupon) throw new NotFoundError('Coupon not found');
    return coupon;
  }

  // Orders
  getAllOrders() {
    return orderService.getAllOrders();
  }
  updateOrderStatus(id, status) {
    return orderService.updateStatus(id, status);
  }

  async getOrderDetails(orderId) {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new NotFoundError('Order not found');
    const user = await this.userRepo.findById(order.userId);
    const customer = user ? user.toSafeJSON() : null;
    return { order, customer };
  }

  // Stats
  async getStats() {
    const [users, coupons, orders] = await Promise.all([
      this.userRepo.findAll(),
      this.couponRepo.findAll(),
      this.orderRepo.find({}, { sort: { createdAt: -1 } }),
    ]);

    const ordersByStatus = {
      [ORDER_STATUS.CREATED]: 0,
      [ORDER_STATUS.PAID]: 0,
      [ORDER_STATUS.SHIPPED]: 0,
      [ORDER_STATUS.DELIVERED]: 0,
      [ORDER_STATUS.CANCELLED]: 0,
    };
    let totalRevenue = 0;
    for (const o of orders) {
      if (ordersByStatus[o.status] !== undefined) ordersByStatus[o.status] += 1;
      if (o.status !== ORDER_STATUS.CANCELLED) {
        totalRevenue += o.pricing?.total || 0;
      }
    }

    return {
      totalOrders: orders.length,
      totalRevenue,
      totalUsers: users.length,
      blockedUsers: users.filter((u) => u.blocked).length,
      totalCoupons: coupons.length,
      activeCoupons: coupons.filter((c) => c.active).length,
      ordersByStatus,
      recentOrders: orders.slice(0, 5),
    };
  }
}

export const adminService = new AdminService();
