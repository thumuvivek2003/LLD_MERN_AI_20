import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getToken,
  setToken,
  clearToken,
  getStoredUser,
  setStoredUser,
} from '../../../shared/services/token.service.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => getStoredUser());
  const [token, setTokenState] = useState(() => getToken());

  useEffect(() => {
    if (user) setStoredUser(user);
  }, [user]);

  const setSession = useCallback((nextToken, nextUser) => {
    setToken(nextToken);
    setStoredUser(nextUser);
    setTokenState(nextToken);
    setUserState(nextUser);
  }, []);

  const clearSession = useCallback(() => {
    clearToken();
    setTokenState(null);
    setUserState(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    role: user?.role || null,
    setSession,
    clearSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthStore() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthStore must be used inside AuthProvider');
  return ctx;
}
