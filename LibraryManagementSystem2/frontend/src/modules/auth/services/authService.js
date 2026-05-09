import apiClient from '../../../shared/services/apiClient.js';

export const login = (email, password) =>
  apiClient.post('/auth/login', { email, password });

export const register = (name, email, password, role) =>
  apiClient.post('/auth/register', { name, email, password, role });
