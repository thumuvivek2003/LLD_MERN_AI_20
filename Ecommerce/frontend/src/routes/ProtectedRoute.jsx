import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../modules/auth/store/auth.store.js';

export default function ProtectedRoute({ role, children }) {
  const { isAuthenticated, role: userRole } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to={userRole === 'admin' ? '/admin' : '/'} replace />;
  }

  return children;
}
