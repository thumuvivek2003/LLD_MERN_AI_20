import {
  getRequest, postRequest, putRequest, patchRequest, deleteRequest,
} from '../../../core/services/api.service.js';

export const getMyRestaurant = () => getRequest('/restaurants/mine');
export const updateMyRestaurant = (id, body) => putRequest(`/restaurants/${id}`, body);

export const getMenu = (restaurantId) =>
  getRequest(`/menu-items/by-restaurant/${restaurantId}`);
export const createMenuItem = (body) => postRequest('/menu-items', body);
export const updateMenuItem = (id, body) => putRequest(`/menu-items/${id}`, body);
export const toggleAvailability = (id) => patchRequest(`/menu-items/${id}/availability`);
export const deleteMenuItem = (id) => deleteRequest(`/menu-items/${id}`);
export const getMenuItem = (id) => getRequest(`/menu-items/${id}`);

export const getIncomingOrders = (restaurantId, status) =>
  getRequest(`/orders/by-restaurant/${restaurantId}`, { params: status ? { status } : {} });
export const getOrder = (id) => getRequest(`/orders/${id}`);
export const updateOrderStatus = (id, status) => patchRequest(`/orders/${id}/status`, { status });
export const assignDeliveryPartner = (id, strategy) => patchRequest(`/orders/${id}/assign`, { strategy });

export const getPartners = () => getRequest('/delivery/partners');
