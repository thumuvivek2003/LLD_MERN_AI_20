import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../modules/auth/store/auth.store.js';
import { ROUTES } from '../shared/constants/routes.constant.js';

/**
 * Restrict children to a specific role. Used for admin routes.
 */
export function RoleRoutes({ role = 'ADMIN' }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  if (user.role !== role) return <Navigate to={ROUTES.CHATS} replace />;
  return <Outlet />;
}
