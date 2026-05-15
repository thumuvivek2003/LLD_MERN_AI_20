import { useCallback } from 'react';
import { useElevatorStore, storeActions } from '../../modules/elevator/store/elevator.store.js';
import {
  controlSimulation,
  setSimulationConfig,
} from '../../modules/elevator/services/elevatorApi.service.js';
import { SIMULATION_STATUS } from '../constants/simulationStatus.js';
import { notify } from '../services/notificationService.js';

export function useSimulation() {
  const simulation = useElevatorStore((s) => s.simulation);

  const play = useCallback(async () => {
    storeActions.setSimulation({ status: SIMULATION_STATUS.RUNNING });
    try {
      await controlSimulation({ action: 'start' });
    } catch (_) {
      notify.error('Failed to start simulation');
    }
  }, []);

  const pause = useCallback(async () => {
    storeActions.setSimulation({ status: SIMULATION_STATUS.PAUSED });
    try {
      await controlSimulation({ action: 'pause' });
    } catch (_) {
      notify.error('Failed to pause simulation');
    }
  }, []);

  const reset = useCallback(async () => {
    try {
      await controlSimulation({ action: 'reset' });
    } catch (_) {
      notify.error('Failed to reset simulation');
    }
  }, []);

  const setSpeed = useCallback(async (speed) => {
    storeActions.setSimulation({ speed });
    try {
      await setSimulationConfig({ speed });
    } catch (_) {
      notify.error('Failed to update speed');
    }
  }, []);

  return { simulation, play, pause, reset, setSpeed };
}
