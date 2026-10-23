import { useMemo } from 'react';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import { useAuthStore } from '../store/auth.store.js';

export function AuthProvider({ children }) {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);

  const value = useMemo(
    () => ({ user, token, isAuthenticated, setSession, clearSession }),
    [user, token, isAuthenticated, setSession, clearSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
