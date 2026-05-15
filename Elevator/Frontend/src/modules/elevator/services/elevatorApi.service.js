import { apiClient } from '../../../config/axios.js';

export async function fetchSnapshot() {
  const { data } = await apiClient.get('/elevator/snapshot');
  return data;
}

export async function createHallRequest({ sourceFloor, direction, destinationFloor = null }) {
  const { data } = await apiClient.post('/elevator/hall-request', {
    sourceFloor,
    direction,
    destinationFloor,
  });
  return data.request;
}

export async function createCabinRequest({ elevatorId, destinationFloor }) {
  const { data } = await apiClient.post('/elevator/cabin-request', {
    elevatorId,
    destinationFloor,
  });
  return data.request;
}

export async function controlSimulation({ action, speed, strategy }) {
  const { data } = await apiClient.post('/elevator/simulation/control', {
    action,
    speed,
    strategy,
  });
  return data;
}

export async function setSimulationConfig({ speed, strategy }) {
  const { data } = await apiClient.post('/elevator/simulation/config', { speed, strategy });
  return data;
}
