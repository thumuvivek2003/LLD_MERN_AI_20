import { couponRepository } from './coupon.repository.js';
import { NotFoundError } from '../../common/errors/NotFoundError.js';
import { ValidationError } from '../../common/errors/ValidationError.js';
import { calculateSubtotal } from '../../common/utils/price.util.js';

export class CouponService {
  constructor(repo = couponRepository) {
    this.repo = repo;
  }

  async listEligibleFor(userId) {
    return this.repo.findEligibleFor(userId);
  }

  async listAll() {
    return this.repo.findAll();
  }

  async validateCoupon(code, userId, cart) {
    const coupon = await this.repo.findByCode(code);
    if (!coupon) throw new NotFoundError('Coupon not found');
    if (!coupon.active) throw new ValidationError('Coupon is inactive', 'COUPON_INACTIVE');
    if (coupon.assignedUserIds.length && !coupon.assignedUserIds.some((id) => String(id) === String(userId))) {
      throw new ValidationError('Coupon not eligible for this user', 'COUPON_NOT_ELIGIBLE');
    }
    const subtotal = calculateSubtotal(cart?.items || []);
    if (coupon.minCartValue && subtotal < coupon.minCartValue) {
      throw new ValidationError(
        `Cart total must be at least ${coupon.minCartValue}`,
        'COUPON_MIN_NOT_MET'
      );
    }
    return coupon;
  }

  async createCoupon(payload) {
    if (!payload.code || !payload.type) throw new ValidationError('code and type are required');
    const exists = await this.repo.findByCode(payload.code);
    if (exists) throw new ValidationError('Coupon code already exists', 'COUPON_DUPLICATE');
    return this.repo.create({
      code: payload.code.toUpperCase(),
      type: payload.type,
      value: payload.value || 0,
      minCartValue: payload.minCartValue || 0,
      description: payload.description || '',
      active: payload.active !== undefined ? payload.active : true,
    });
  }

  async toggleCoupon(id) {
    const coupon = await this.repo.findById(id);
    if (!coupon) throw new NotFoundError('Coupon not found');
    coupon.active = !coupon.active;
    await coupon.save();
    return coupon;
  }

  async assignCoupon(couponId, userId) {
    const coupon = await this.repo.assignToUser(couponId, userId);
    if (!coupon) throw new NotFoundError('Coupon not found');
    return coupon;
  }
}

export const couponService = new CouponService();
