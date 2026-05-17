import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.js';
import * as authService from '../services/auth.service.js';
import { ROLES } from '../../../shared/constants/roles.constant.js';
import { ROUTES } from '../../../shared/constants/routes.constant.js';

/**
 * Composition hook exposing all auth side-effects to UI layer.
 */
export function useAuth() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const pendingMobile = useAuthStore((s) => s.pendingMobile);
  const setPendingMobile = useAuthStore((s) => s.setPendingMobile);
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);

  const requestOtp = useCallback(
    async (mobile) => {
      const data = await authService.loginWithMobile(mobile);
      setPendingMobile(mobile);
      return data; // { mobile, otp }
    },
    [setPendingMobile]
  );

  const verify = useCallback(
    async ({ mobile, otp, name }) => {
      const data = await authService.verifyOtp({ mobile, otp, name });
      setSession({ token: data.token, user: data.user });
      const target =
        data.user?.role === ROLES.ADMIN ? ROUTES.ADMIN : ROUTES.CHATS;
      navigate(target, { replace: true });
      return data;
    },
    [setSession, navigate]
  );

  const signOut = useCallback(async () => {
    try {
      await authService.logout();
    } catch (_err) {
      // ignore — we still clear locally
    }
    clearSession();
    navigate(ROUTES.LOGIN, { replace: true });
  }, [clearSession, navigate]);

  return {
    user,
    token,
    pendingMobile,
    isAuthenticated: Boolean(token && user),
    isAdmin: user?.role === ROLES.ADMIN,
    requestOtp,
    verify,
    signOut,
  };
}
