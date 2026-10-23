import { Navigate } from 'react-router-dom';
import { useRole } from '../../hooks/useRole.js';
import { Routes } from '../../constants/routes.js';

export function RoleBasedRoute({ allow, children }) {
  const { hasRole } = useRole();

  if (!hasRole(allow)) {
    return <Navigate to={Routes.LOGIN} replace />;
  }

  return children;
}
