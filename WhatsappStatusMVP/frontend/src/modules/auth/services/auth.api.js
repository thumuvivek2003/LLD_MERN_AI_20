// modules/auth/services/auth.api.js — the ONLY place auth HTTP lives.
import { http } from '../../../core/api/axios.js';

export const authApi = {
  listUsers: () => http.get('/users'),
  login: (userId) => http.post(`/users/${userId}/login`),
};
