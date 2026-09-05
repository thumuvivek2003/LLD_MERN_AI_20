// modules/auth/context/AuthProvider.jsx — Provider pattern (dependency injection)
// Holds the current user, persists it, wires the http client + socket identity.
import { createContext, useContext, useEffect, useState } from 'react';
import { setCurrentUserId } from '../../../core/api/axios.js';
import { identify } from '../../../core/socket/socket.js';

const AuthContext = createContext(null);
const STORAGE_KEY = 'wa_status_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
    } catch {
      return null;
    }
  });

  // Keep the http client + socket in sync with whoever is logged in.
  useEffect(() => {
    setCurrentUserId(user?.id || null);
    if (user?.id) identify(user.id);
  }, [user]);

  const login = (u) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setCurrentUserId(u.id);
    identify(u.id);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentUserId(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
