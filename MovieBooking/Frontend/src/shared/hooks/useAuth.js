import { useAuthStore } from '../../features/auth/auth.store.js';

export const useAuth = () => {
  const { user, token, setAuth, clearAuth } = useAuthStore();
  return { user, token, isAuthenticated: !!token, isAdmin: user?.role === 'admin', setAuth, clearAuth };
};
