import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../core/context/AuthContext.jsx';

export const ProtectedRoute = ({ children }) => {
  const { isAuthed } = useAuthContext();
  const location = useLocation();
  if (!isAuthed) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
};
