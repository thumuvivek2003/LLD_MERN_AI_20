import { useAuth } from './useAuth.js';

export const useRole = () => {
  const { user } = useAuth();
  const role = user?.role;
  const has = (...roles) => roles.includes(role);
  return { role, has };
};
