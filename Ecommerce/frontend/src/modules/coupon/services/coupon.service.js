import { apiClient } from '../../../shared/services/apiClient.js';

export async function getCoupons() {
  return apiClient.get('/coupons');
}

export async function applyCouponCode(code) {
  return apiClient.post('/cart/coupon', { code });
}

export async function removeAppliedCoupon() {
  return apiClient.delete('/cart/coupon');
}
