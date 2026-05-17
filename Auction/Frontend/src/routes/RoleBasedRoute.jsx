import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../modules/auth/store/auth.store.js';
import { roleHomeRoute } from '../modules/auth/hooks/useAuth.js';
import { ROUTES } from '../modules/shared/constants/routes.constant.js';

export default function RoleBasedRoute({ role, children }) {
  const location = useLocation();
  const { user, token } = useAuthStore();

  if (!user || !token) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }
  if (role && user.role !== role) {
    return <Navigate to={roleHomeRoute(user.role)} replace />;
  }
  return children;
}
