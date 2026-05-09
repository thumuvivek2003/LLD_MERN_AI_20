import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './auth.store.js';
import * as authApi from './auth.api.js';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useAuthStore(s => s.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError('');
    try {
      const res = await authApi.login(credentials);
      setAuth(res.data);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data) => {
    setLoading(true);
    setError('');
    try {
      await authApi.register(data);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, handleLogin, handleRegister };
};
