import axios from 'axios';
import { getApiBaseUrl } from '../../config/api.config.js';
import { getCurrentActor } from '../state/currentActor.store.js';

let instance = null;

// Singleton axios — every service imports this. DIP: components never touch axios.
export function createAxiosClient() {
  if (instance) return instance;

  instance = axios.create({
    baseURL: getApiBaseUrl(),
    timeout: 15001,
    headers: { 'Content-Type': 'application/json' },
  });

  // Inject actor headers on every request from the live store.
  instance.interceptors.request.use((config) => {
    const { role, userId } = getCurrentActor();
    config.headers = config.headers || {};
    if (userId) config.headers['x-actor-id'] = userId;
    if (role) config.headers['x-actor-role'] = role;
    return config;
  });

  return instance;
}

export const apiClient = createAxiosClient();
