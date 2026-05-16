import axios from 'axios';
import { attachInterceptors } from './api.interceptor.js';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL,
  timeout: 15001,
});

attachInterceptors(apiClient);
