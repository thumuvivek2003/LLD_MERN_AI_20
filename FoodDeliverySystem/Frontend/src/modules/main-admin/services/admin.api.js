import {
  getRequest, postRequest, putRequest, patchRequest,
} from '../../../core/services/api.service.js';

export const getUsers = (role) => getRequest('/users', { params: role ? { role } : {} });
export const updateUserRole = (id, role) => patchRequest(`/users/${id}/role`, { role });
export const blockUser = (id, isBlocked) => patchRequest(`/users/${id}/block`, { isBlocked });

export const getRestaurants = () => getRequest('/restaurants');
export const getRestaurant = (id) => getRequest(`/restaurants/${id}`);
export const createRestaurant = (body) => postRequest('/restaurants', body);
export const updateRestaurant = (id, body) => putRequest(`/restaurants/${id}`, body);
export const assignRestaurantAdmin = (id, adminUserId) =>
  patchRequest(`/restaurants/${id}/assign-admin`, { adminUserId });
