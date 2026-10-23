import { useAuth } from './useAuth.js';

export const useRole = () => {
  const { user } = useAuth();
  const role = user?.role;

  return {
    role,
    hasRole: (allowed = []) => {
      if (!allowed || allowed.length === 0) return true;
      return allowed.includes(role);
    },
    isAdmin: role === 'ADMIN',
    isAttendant: role === 'ATTENDANT',
  };
};
