import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/auth.store.js';

export default function ProtectedRoute({ children, role }) {
  const { user, token } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/'} replace />;
  }
  return children;
}
