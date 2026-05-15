import { useCallback } from 'react';
import { useElevatorStore, storeActions } from '../store/elevator.store.js';
import { createHallRequest, createCabinRequest } from '../services/elevatorApi.service.js';
import { mapRequestDto } from '../mapper/elevator.mapper.js';
import { notify } from '../../../shared/services/notificationService.js';

export function useElevatorSimulation() {
  const elevators = useElevatorStore((s) => s.elevators);
  const selectedElevatorId = useElevatorStore((s) => s.selectedElevatorId);
  const requests = useElevatorStore((s) => s.requests);
  const stats = useElevatorStore((s) => s.stats);

  const selected = elevators.find((e) => e.id === selectedElevatorId) || elevators[0];

  const submitHallCall = useCallback(async (floor, direction) => {
    try {
      const req = await createHallRequest({ sourceFloor: floor, direction });
      if (req) storeActions.upsertRequest(mapRequestDto(req));
      storeActions.appendEventLog({ message: `Hall Call F${floor} ${direction}` });
    } catch (e) {
      notify.error('Failed to create hall call');
    }
  }, []);

  const submitCabinRequest = useCallback(async (elevatorId, floor) => {
    if (!elevatorId) return;
    try {
      const req = await createCabinRequest({ elevatorId, destinationFloor: floor });
      if (req) storeActions.upsertRequest(mapRequestDto(req));
      storeActions.appendEventLog({ message: `Cabin ${elevatorId} → F${floor}` });
    } catch (e) {
      notify.error('Failed to create cabin request');
    }
  }, []);

  const selectElevator = useCallback((id) => storeActions.selectElevator(id), []);

  return {
    elevators,
    selected,
    selectedElevatorId,
    requests,
    stats,
    submitHallCall,
    submitCabinRequest,
    selectElevator,
  };
}
