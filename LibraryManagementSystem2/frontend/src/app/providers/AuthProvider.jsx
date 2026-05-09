import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore.js';
import { getToken } from '../../shared/services/tokenService.js';
import { getStorageItem } from '../../shared/utils/storageUtils.js';

export function AuthProvider({ children }) {
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const token = getToken();
    const user = getStorageItem('lms_user');
    if (token && user) setAuth(user, token);
  }, []);

  return children;
}
