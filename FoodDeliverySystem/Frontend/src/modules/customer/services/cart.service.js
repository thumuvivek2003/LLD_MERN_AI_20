import * as api from './customer.api.js';

export const addToCart = (menuItemId, quantity = 1) => api.addItem({ menuItemId, quantity });
export const removeFromCart = (menuItemId) => api.removeItem(menuItemId);
export const getCartTotal = (cart) =>
  (cart?.items || []).reduce((s, i) => s + i.price * i.quantity, 0);
