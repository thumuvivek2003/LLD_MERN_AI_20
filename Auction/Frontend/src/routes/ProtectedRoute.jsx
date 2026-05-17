import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../modules/auth/store/auth.store.js';
import { ROUTES } from '../modules/shared/constants/routes.constant.js';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { user, token } = useAuthStore();
  if (!user || !token) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }
  return children;
}
