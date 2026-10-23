import { useMutation } from '@tanstack/react-query';
import { authFeatureService } from '../services/AuthFeatureService.js';

export const useLogin = (options = {}) =>
  useMutation({
    mutationFn: (payload) => authFeatureService.login(payload),
    ...options,
  });
