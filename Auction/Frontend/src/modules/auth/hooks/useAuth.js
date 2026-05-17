import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.js';
import { authApi } from '../services/auth.api.js';
import { ROLES } from '../../shared/constants/roles.constant.js';
import { ROUTES } from '../../shared/constants/routes.constant.js';
import { showSuccessToast } from '../../shared/utils/toast.util.js';

export function roleHomeRoute(role) {
  if (role === ROLES.ADMIN) return ROUTES.ADMIN_DASHBOARD;
  if (role === ROLES.MEMBER) return ROUTES.MEMBER_DASHBOARD;
  if (role === ROLES.SPECTATOR) return ROUTES.SPECTATOR_HOME;
  return ROUTES.LOGIN;
}

export function useAuth() {
  const navigate = useNavigate();
  const { user, token, setUser, logout } = useAuthStore();

  async function performLogin(credentials) {
    const data = await authApi.login(credentials);
    setUser(data.user, data.token);
    showSuccessToast(`Welcome back, ${data.user.name}`);
    navigate(roleHomeRoute(data.user.role), { replace: true });
    return data.user;
  }

  async function performRegister(payload) {
    const data = await authApi.register(payload);
    setUser(data.user, data.token);
    showSuccessToast('Account created');
    navigate(roleHomeRoute(data.user.role), { replace: true });
    return data.user;
  }

  function performLogout() {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  }

  return {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    login: performLogin,
    register: performRegister,
    logout: performLogout,
  };
}
