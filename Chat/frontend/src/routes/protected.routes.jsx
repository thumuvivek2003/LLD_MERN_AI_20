import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../modules/auth/store/auth.store.js';
import { ROUTES } from '../shared/constants/routes.constant.js';

/**
 * Gate around all authenticated routes — redirects to /login if no token.
 */
export function ProtectedRoutes() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }
  return <Outlet />;
}
