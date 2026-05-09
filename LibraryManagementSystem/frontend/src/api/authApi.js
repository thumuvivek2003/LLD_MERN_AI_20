import api from './axiosConfig';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.patch('/auth/profile', data),
  getAllUsers: (params) => api.get('/auth/users', { params }),
  toggleUserStatus: (id) => api.patch(`/auth/users/${id}/toggle-status`),
};
