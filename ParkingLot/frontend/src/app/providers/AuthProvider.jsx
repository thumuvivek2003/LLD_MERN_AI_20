import { AuthContext } from '../../contexts/AuthContext.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export const AuthProvider = ({ children }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
