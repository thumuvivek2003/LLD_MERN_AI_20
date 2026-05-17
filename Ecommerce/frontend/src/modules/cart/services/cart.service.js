import { apiClient } from '../../../shared/services/apiClient.js';

export async function fetchCart() {
  return apiClient.get('/cart');
}

export async function addToCart(productId, quantity = 1) {
  return apiClient.post('/cart/items', { productId, quantity });
}

export async function updateQty(productId, quantity) {
  return apiClient.patch(`/cart/items/${productId}`, { quantity });
}

export async function removeFromCart(productId) {
  return apiClient.delete(`/cart/items/${productId}`);
}

export async function applyCouponToCart(code) {
  return apiClient.post('/cart/coupon', { code });
}

export async function removeCouponFromCart() {
  return apiClient.delete('/cart/coupon');
}

export async function clearCartItems() {
  return apiClient.delete('/cart');
}
