import { createContext, useContext } from 'react';
import { useAuthStore } from '../../modules/auth/store/auth.store.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const auth = useAuthStore();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}

export default AuthProvider;
