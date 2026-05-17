import { useState } from 'react';
import { useAuthStore } from '../store/auth.store.js';
import { loginUser, registerUser } from '../services/auth.service.js';

export function useAuth() {
  const { user, token, isAuthenticated, role, setSession, clearSession } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function login(credentials) {
    setLoading(true);
    setError('');
    try {
      const data = await loginUser(credentials);
      setSession(data.token, data.user);
      return data.user;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  async function register(payload) {
    setLoading(true);
    setError('');
    try {
      const data = await registerUser(payload);
      setSession(data.token, data.user);
      return data.user;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearSession();
  }

  return { user, token, isAuthenticated, role, loading, error, login, register, logout };
}
