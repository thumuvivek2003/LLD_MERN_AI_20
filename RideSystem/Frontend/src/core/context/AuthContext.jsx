import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { storageService } from '../services/storage.service.js';
import { apiClient } from '../api/axios.client.js';
import { API } from '../api/api.endpoints.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storageService.getUser());
  const [token, setToken] = useState(() => storageService.getToken());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user && token) {
      apiClient.get(API.users.me).then((r) => {
        setUser(r.data);
        storageService.setUser(r.data);
      }).catch(() => signOut());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await apiClient.post(API.auth.login, { email, password });
      const { token: t, user: u } = res.data;
      storageService.setToken(t);
      storageService.setUser(u);
      setToken(t);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (payload) => {
    setLoading(true);
    try {
      const res = await apiClient.post(API.auth.register, payload);
      const { token: t, user: u } = res.data;
      storageService.setToken(t);
      storageService.setUser(u);
      setToken(t);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    storageService.clear();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, loading, signIn, signUp, signOut }), [user, token, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthCtx = () => useContext(AuthContext);
