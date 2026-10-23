import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsApi } from '../api.js';

export const useParkVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ticketsApi.park,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['parking-lots'] });
      qc.invalidateQueries({ queryKey: ['slots-by-lot'] });
    },
  });
};

export const useExitVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ticketsApi.exit,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['parking-lots'] });
      qc.invalidateQueries({ queryKey: ['slots-by-lot'] });
    },
  });
};
