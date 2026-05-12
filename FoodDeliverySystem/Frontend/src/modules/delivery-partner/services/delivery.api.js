import {
  getRequest, postRequest, patchRequest,
} from '../../../core/services/api.service.js';

export const getMyProfile = () => getRequest('/delivery/me');
export const setAvailability = (status) => patchRequest('/delivery/me/availability', { status });
export const getMyOrders = (status) => getRequest('/delivery/me/orders', { params: status ? { status } : {} });
export const acceptDelivery = (orderId) => postRequest(`/delivery/orders/${orderId}/accept`);
export const rejectDelivery = (orderId) => postRequest(`/delivery/orders/${orderId}/reject`);
export const verifyDeliveryOtp = (orderId, otp) => postRequest(`/delivery/orders/${orderId}/verify-otp`, { otp });
export const completeDelivery = (orderId, otp) => verifyDeliveryOtp(orderId, otp);
export const getOrder = (id) => getRequest(`/orders/${id}`);
