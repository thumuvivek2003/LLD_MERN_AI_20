import { Navigate } from 'react-router-dom';
import { useRole } from '../../hooks/useRole.js';
import { Routes as R } from '../../constants/routes.js';

export const RoleBasedRoute = ({ allow = [], children }) => {
  const { has } = useRole();
  if (!has(...allow)) return <Navigate to={R.LOGIN} replace />;
  return children;
};
