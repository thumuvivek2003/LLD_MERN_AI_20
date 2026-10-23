// context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated, logout as authLogout } from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const initAuth = () => {
      const currentUser = getCurrentUser();
      const authenticated = isAuthenticated();

      setUser(currentUser);
      setIsAuth(authenticated);
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuth(true);
  };



  const logout = () => {
    authLogout(); // <-- clears storage
    setUser(null);
    setIsAuth(false);
  };


  const updateUser = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('token', token);
    }
    setUser(userData);
    setIsAuth(true);
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };



  return (
    <AuthContext.Provider value={{ user, isAuth, loading, login, logout, updateUser, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};