import apiClient from '../../../shared/services/apiClient.js';

export const requestBorrow = (bookId) => apiClient.post('/borrow/request', { bookId });
export const approveRequest = (id) => apiClient.put(`/borrow/${id}/approve`);
export const rejectRequest = (id) => apiClient.put(`/borrow/${id}/reject`);
export const returnBook = (id) => apiClient.put(`/borrow/${id}/return`);
export const getBorrowHistory = (userId) => apiClient.get(`/borrow/history/${userId}`);
