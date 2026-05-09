import apiClient from '../../../shared/services/apiClient.js';

export const getUsers = () => apiClient.get('/users');
export const getUser = (id) => apiClient.get(`/users/${id}`);
export const addUser = (data) => apiClient.post('/users', data);
export const activateUser = (id) => apiClient.put(`/users/${id}/activate`);
export const deactivateUser = (id) => apiClient.put(`/users/${id}/deactivate`);
export const assignRole = (id, role) => apiClient.put(`/users/${id}/role`, { role });
