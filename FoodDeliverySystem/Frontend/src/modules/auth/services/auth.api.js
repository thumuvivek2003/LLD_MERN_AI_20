import { postRequest } from '../../../core/services/api.service.js';

export const loginUser = (credentials) => postRequest('/auth/login', credentials);
export const registerUser = (payload) => postRequest('/auth/register', payload);
