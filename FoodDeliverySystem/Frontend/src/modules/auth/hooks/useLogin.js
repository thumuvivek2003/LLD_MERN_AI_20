import { useState } from 'react';
import { useAuthContext } from '../../../core/context/AuthContext.jsx';
import { showErrorToast, showSuccessToast } from '../../../core/services/notification.service.js';

export const useLogin = () => {
  const { login } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const submit = async (credentials) => {
    setLoading(true);
    try {
      const user = await login(credentials);
      showSuccessToast(`Welcome, ${user.name}`);
      return user;
    } catch (e) {
      showErrorToast(e.message);
      throw e;
    } finally { setLoading(false); }
  };
  return { submit, loading };
};
