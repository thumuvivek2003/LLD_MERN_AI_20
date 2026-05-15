import { useSyncExternalStore } from 'react';
import { SIMULATION_STATUS } from '../../../shared/constants/simulationStatus.js';

const listeners = new Set();

let state = {
  elevators: [
    { id: 'E1', currentFloor: 0, direction: 'NONE', state: 'IDLE', queue: [], online: true, peopleInside: 0 },
    { id: 'E2', currentFloor: 0, direction: 'NONE', state: 'IDLE', queue: [], online: true, peopleInside: 0 },
    { id: 'E3', currentFloor: 0, direction: 'NONE', state: 'IDLE', queue: [], online: true, peopleInside: 0 },
    { id: 'E4', currentFloor: 0, direction: 'NONE', state: 'IDLE', queue: [], online: true, peopleInside: 0 },
  ],
  requests: [],
  eventLogs: [],
  simulation: { status: SIMULATION_STATUS.RUNNING, speed: 1 },
  stats: { peopleInside: 0, activeRequests: 0, totalRequests: 0, efficiency: 0 },
  selectedElevatorId: 'E1',
  strategy: 'NEAREST',
};

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function useElevatorStore(selector = (s) => s) {
  return useSyncExternalStore(subscribe, () => selector(getSnapshot()), () => selector(getSnapshot()));
}

export const storeActions = {
  setSnapshot(patch) {
    state = { ...state, ...patch };
    emit();
  },
  applyElevatorUpdate(update) {
    const elevators = state.elevators.map((e) => (e.id === update.id ? { ...e, ...update } : e));
    state = { ...state, elevators };
    emit();
  },
  appendEventLog(entry) {
    const log = { id: entry.id || `${Date.now()}-${Math.random()}`, timestamp: entry.timestamp || new Date().toISOString(), message: entry.message, level: entry.level || 'info' };
    const eventLogs = [log, ...state.eventLogs].slice(0, 100);
    state = { ...state, eventLogs };
    emit();
  },
  setRequests(requests) {
    state = { ...state, requests };
    emit();
  },
  upsertRequest(req) {
    const existing = state.requests.findIndex((r) => r.id === req.id);
    const next = [...state.requests];
    if (existing >= 0) next[existing] = { ...next[existing], ...req };
    else next.unshift(req);
    state = { ...state, requests: next };
    emit();
  },
  removeRequest(id) {
    state = { ...state, requests: state.requests.filter((r) => r.id !== id) };
    emit();
  },
  setSimulation(patch) {
    state = { ...state, simulation: { ...state.simulation, ...patch } };
    emit();
  },
  setStats(stats) {
    state = { ...state, stats: { ...state.stats, ...stats } };
    emit();
  },
  selectElevator(id) {
    state = { ...state, selectedElevatorId: id };
    emit();
  },
  setStrategy(strategy) {
    state = { ...state, strategy };
    emit();
  },
};
