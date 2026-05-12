import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  setAccessToken, clearAccessToken, getStoredUser, setStoredUser, getAccessToken,
} from '../services/token.service.js';
import { loginUser, registerUser } from '../../modules/auth/services/auth.api.js';
import { getRequest } from '../services/api.service.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (token && !user) {
      getRequest('/users/me').then((r) => {
        if (r?.data) { setUser(r.data); setStoredUser(r.data); }
      }).catch(() => {});
    }
  }, []); // eslint-disable-line

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const res = await loginUser(credentials);
      const { token, user } = res.data;
      setAccessToken(token); setStoredUser(user); setUser(user);
      return user;
    } finally { setLoading(false); }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      const res = await registerUser(payload);
      const { token, user } = res.data;
      setAccessToken(token); setStoredUser(user); setUser(user);
      return user;
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(() => { clearAccessToken(); setUser(null); }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthed: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
};
