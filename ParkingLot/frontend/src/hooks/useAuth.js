import { useAuthStore } from '../app/store/auth.store.js';

export const useAuth = () => {
  const { token, user, setSession, clear } = useAuthStore();
  return { token, user, isAuthenticated: !!token, setSession, logout: clear };
};
