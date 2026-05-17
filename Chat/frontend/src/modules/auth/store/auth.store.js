import { create } from 'zustand';
import {
  getStorage,
  setStorage,
  removeStorage,
} from '../../../shared/utils/storage.util.js';

const TOKEN_KEY = 'auth.token';
const USER_KEY = 'auth.user';

/**
 * Auth store — persists JWT + user to localStorage so reloads keep the session.
 */
export const useAuthStore = create((set, get) => ({
  token: getStorage(TOKEN_KEY),
  user: getStorage(USER_KEY),
  pendingMobile: null,

  isAuthenticated: () => Boolean(get().token && get().user),

  setPendingMobile(mobile) {
    set({ pendingMobile: mobile });
  },

  setSession({ token, user }) {
    setStorage(TOKEN_KEY, token);
    setStorage(USER_KEY, user);
    set({ token, user });
  },

  updateUser(patch) {
    const next = { ...(get().user || {}), ...patch };
    setStorage(USER_KEY, next);
    set({ user: next });
  },

  clearSession() {
    removeStorage(TOKEN_KEY);
    removeStorage(USER_KEY);
    set({ token: null, user: null, pendingMobile: null });
  },
}));
