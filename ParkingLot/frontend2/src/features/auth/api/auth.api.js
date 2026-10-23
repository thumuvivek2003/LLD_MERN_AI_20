import { authService } from '../../../services/auth.service.js';

export const authApi = {
  login: (payload) => authService.login(payload),
  register: (payload) => authService.register(payload),
};
