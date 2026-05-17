import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/auth.service.js';
import { useAuthStore } from '../store/auth.store.js';
import { ROUTES } from '../../shared/constants/routes.js';
import { extractErrorMessage } from '../../shared/utils/response.util.js';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submit({ username, password }) {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login({ username, password });
      setAuth(data.token, data.user);
      navigate(data.user.role === 'admin' ? ROUTES.ADMIN : ROUTES.CLIENT, {
        replace: true,
      });
      return data;
    } catch (err) {
      setError(extractErrorMessage(err, 'Login failed'));
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, error };
}

export function useLogout() {
  const clear = useAuthStore((s) => s.clear);
  const navigate = useNavigate();
  return () => {
    clear();
    navigate(ROUTES.LOGIN, { replace: true });
  };
}
