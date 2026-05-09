import api from '../../shared/api/axios.js';
import { ENDPOINTS } from '../../shared/api/apiEndpoints.js';

export const login = (data) => api.post(ENDPOINTS.auth.login, data);
export const register = (data) => api.post(ENDPOINTS.auth.register, data);
export const logout = () => api.post(ENDPOINTS.auth.logout);
