import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../core/context/AuthContext.jsx';

export const RoleBasedRoute = ({ roles, children }) => {
  const { user, isAuthed } = useAuthContext();
  if (!isAuthed) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  return children;
};
