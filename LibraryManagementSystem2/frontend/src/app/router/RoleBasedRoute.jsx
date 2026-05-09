import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { ROUTES } from '../../shared/constants/routes.js';

export default function RoleBasedRoute({ roles }) {
  const user = useAuthStore((s) => s.user);
  return roles.includes(user?.role) ? <Outlet /> : <Navigate to={ROUTES.BOOKS} replace />;
}
