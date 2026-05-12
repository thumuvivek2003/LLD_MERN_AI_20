import {
  getRequest, postRequest, patchRequest, deleteRequest,
} from '../../../core/services/api.service.js';

// Restaurants
export const getRestaurants = (params) => getRequest('/restaurants', { params });
export const getRestaurantDetails = (id) => getRequest(`/restaurants/${id}`);
export const getRestaurantMenu = (restaurantId, available = true) =>
  getRequest(`/menu-items/by-restaurant/${restaurantId}`, { params: { available } });
export const getMenuItem = (id) => getRequest(`/menu-items/${id}`);

// Cart
export const getCart = () => getRequest('/cart');
export const addItem = (body) => postRequest('/cart/items', body);
export const removeItem = (menuItemId) => deleteRequest(`/cart/items/${menuItemId}`);
export const updateQuantity = (menuItemId, quantity) => patchRequest(`/cart/items/${menuItemId}`, { quantity });
export const clearCart = () => deleteRequest('/cart');

// Orders
export const placeOrder = (body) => postRequest('/orders', body);
export const getMyOrders = () => getRequest('/orders/me');
export const getOrderById = (id) => getRequest(`/orders/${id}`);
export const cancelOrder = (id) => patchRequest(`/orders/${id}/status`, { status: 'CANCELLED' });
