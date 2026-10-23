// context/RoleContext.jsx
import { createContext, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  const isMember = () => hasRole('member');
  const isLibrarian = () => hasRole('librarian');
  const isAdmin = () => hasRole('admin');

  return (
    <RoleContext.Provider value={{ hasRole, hasAnyRole, isMember, isLibrarian, isAdmin }}>
      {children}
    </RoleContext.Provider>
  );
};