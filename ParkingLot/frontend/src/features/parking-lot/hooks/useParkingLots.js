import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { parkingLotFeatureService } from '../services/ParkingLotFeatureService.js';

const KEY = ['parking-lots'];

export const useParkingLots = () =>
  useQuery({ queryKey: KEY, queryFn: parkingLotFeatureService.list });

export const useCreateParkingLot = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: parkingLotFeatureService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};
