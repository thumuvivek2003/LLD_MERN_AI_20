import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parkingLotFeatureService } from '../services/ParkingLotFeatureService.js';

const KEY = ['parking-lots'];

export const useParkingLots = () =>
  useQuery({ queryKey: KEY, queryFn: () => parkingLotFeatureService.list() });

export const useParkingLot = (id) =>
  useQuery({
    queryKey: [...KEY, id],
    queryFn: () => parkingLotFeatureService.get(id),
    enabled: Boolean(id),
  });

export const useCreateParkingLot = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => parkingLotFeatureService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};

export const useSlotsByLot = (lotId) =>
  useQuery({
    queryKey: ['slots-by-lot', lotId],
    queryFn: () => parkingLotFeatureService.listSlots(lotId),
    enabled: Boolean(lotId),
  });
