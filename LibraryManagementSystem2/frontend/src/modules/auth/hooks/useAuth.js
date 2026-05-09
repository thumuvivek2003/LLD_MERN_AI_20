import { useAuthStore } from '../../../app/store/authStore.js';
import { login as loginApi, register as registerApi } from '../services/authService.js';
import { setToken, removeToken } from '../../../shared/services/tokenService.js';
import { setStorageItem, removeStorageItem } from '../../../shared/utils/storageUtils.js';

export function useAuth() {
  const { user, token, setAuth, clearAuth } = useAuthStore();

  const login = async (email, password) => {
    const { data } = await loginApi(email, password);
    setToken(data.data.token);
    setStorageItem('lms_user', data.data.user);
    setAuth(data.data.user, data.data.token);
  };

  const logout = () => {
    removeToken();
    removeStorageItem('lms_user');
    clearAuth();
  };

  const register = async (name, email, password, role = 'MEMBER') => {
    await registerApi(name, email, password, role);
  };

  return { user, token, login, logout, register };
}
