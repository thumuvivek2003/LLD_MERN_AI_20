import { create } from 'zustand';
import { tokenService } from '../../shared/services/token.service.js';
import { storageService } from '../../shared/services/storage.service.js';

export const useAuthStore = create((set) => ({
  user: storageService.getUser(),
  token: tokenService.get(),
  setAuth: ({ user, token }) => {
    tokenService.set(token);
    storageService.setUser(user);
    set({ user, token });
  },
  clearAuth: () => {
    storageService.clear();
    set({ user: null, token: null });
  },
}));
