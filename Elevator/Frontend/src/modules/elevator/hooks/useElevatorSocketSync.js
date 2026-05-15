import { useEffect } from 'react';
import { initializeSocket } from '../../../config/socket.js';
import { ELEVATOR_EVENTS } from '../services/elevatorSocket.service.js';
import { storeActions } from '../store/elevator.store.js';
import {
  mapElevatorDto,
  mapRequestDto,
  mapSnapshotDto,
  mapEventLogDto,
} from '../mapper/elevator.mapper.js';

export function useElevatorSocketSync() {
  useEffect(() => {
    const socket = initializeSocket();

    const onTick = (snapshot) => {
      const s = mapSnapshotDto(snapshot || {});
      storeActions.setSnapshot({
        elevators: s.elevators.length ? s.elevators : undefined,
        requests: s.requests,
        stats: s.stats,
        simulation: s.simulation,
      });
    };
    const onUpdate = (dto) => storeActions.applyElevatorUpdate(mapElevatorDto(dto));
    const onLog = (entry) => storeActions.appendEventLog(mapEventLogDto(entry));
    const onReqCreated = (dto) => storeActions.upsertRequest(mapRequestDto(dto));
    const onReqCompleted = (dto) => storeActions.removeRequest(dto.id);

    socket.on(ELEVATOR_EVENTS.TICK, onTick);
    socket.on(ELEVATOR_EVENTS.UPDATE, onUpdate);
    socket.on(ELEVATOR_EVENTS.EVENT_LOG, onLog);
    socket.on(ELEVATOR_EVENTS.REQUEST_CREATED, onReqCreated);
    socket.on(ELEVATOR_EVENTS.REQUEST_COMPLETED, onReqCompleted);

    return () => {
      socket.off(ELEVATOR_EVENTS.TICK, onTick);
      socket.off(ELEVATOR_EVENTS.UPDATE, onUpdate);
      socket.off(ELEVATOR_EVENTS.EVENT_LOG, onLog);
      socket.off(ELEVATOR_EVENTS.REQUEST_CREATED, onReqCreated);
      socket.off(ELEVATOR_EVENTS.REQUEST_COMPLETED, onReqCompleted);
    };
  }, []);
}
