import { useMutation } from '@tanstack/react-query';
import { authFeatureService } from '../services/AuthFeatureService.js';
import { useAuth } from '../../../hooks/useAuth.js';

export const useLogin = () => {
  const { setSession } = useAuth();
  return useMutation({
    mutationFn: (credentials) => authFeatureService.login(credentials),
    onSuccess: (data) => setSession(data),
  });
};
