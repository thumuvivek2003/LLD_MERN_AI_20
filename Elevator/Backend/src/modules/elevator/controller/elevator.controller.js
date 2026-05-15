import { asyncHandler } from "../../../shared/errors/asyncHandler.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { validateCreateHallRequest } from "../dto/createHallRequest.dto.js";
import { validateCreateCabinRequest } from "../dto/createCabinRequest.dto.js";
import { requestService } from "../service/RequestService.js";
import { elevatorSimulationService } from "../service/ElevatorSimulationService.js";
import { simulationScheduler } from "../scheduler/SimulationScheduler.js";
import { SIMULATION_STATUS } from "../../../shared/constants/elevatorEvent.js";

export const createHallRequest = asyncHandler(async (req, res) => {
  const dto = validateCreateHallRequest(req.body);
  const totalFloors = elevatorSimulationService.simulation.totalFloors;
  const reqDoc = await requestService.createHallRequest(dto, totalFloors);
  const assigned = await elevatorSimulationService.dispatchHallRequest(reqDoc);
  if (assigned && dto.destinationFloor !== null) {
    elevatorSimulationService.dispatchCabinRequest(assigned.elevatorId, dto.destinationFloor);
  }
  res.status(201).json({ success: true, request: requestService.toPayload(reqDoc) });
});

export const createCabinRequest = asyncHandler(async (req, res) => {
  const dto = validateCreateCabinRequest(req.body);
  const elevator = elevatorSimulationService.getElevatorById(dto.elevatorId);
  if (!elevator) throw new AppError(`Elevator ${dto.elevatorId} not found`, 404);
  const totalFloors = elevatorSimulationService.simulation.totalFloors;
  const reqDoc = await requestService.createCabinRequest(
    {
      elevatorId: dto.elevatorId,
      currentFloor: elevator.currentFloor,
      destinationFloor: dto.destinationFloor,
    },
    totalFloors
  );
  elevatorSimulationService.dispatchCabinRequest(dto.elevatorId, dto.destinationFloor);
  res.status(201).json({ success: true, request: requestService.toPayload(reqDoc) });
});

export const getSystemSnapshot = asyncHandler(async (_req, res) => {
  const snapshot = await elevatorSimulationService.getSnapshot();
  res.json({ success: true, ...snapshot });
});

export const setSimulationConfig = asyncHandler(async (req, res) => {
  const { speed, strategy } = req.body || {};
  const updates = {};
  if (speed !== undefined && Number(speed) > 0) updates.speed = Number(speed);
  if (strategy) updates.strategyName = String(strategy).toUpperCase();
  if (Object.keys(updates).length === 0) {
    throw new AppError("speed or strategy is required", 400);
  }
  await elevatorSimulationService.updateSimulation(updates);
  if (updates.speed !== undefined) simulationScheduler.restart();
  const snapshot = await elevatorSimulationService.getSnapshot();
  res.json({ success: true, ...snapshot });
});

export const controlSimulation = asyncHandler(async (req, res) => {
  const { action, speed, strategy } = req.body || {};
  if (!["start", "pause", "stop", "reset"].includes(action)) {
    throw new AppError("action must be one of start|pause|stop|reset", 400);
  }
  const updates = {};
  if (speed && Number(speed) > 0) updates.speed = Number(speed);
  if (strategy) updates.strategyName = String(strategy).toUpperCase();

  if (action === "start") {
    updates.status = SIMULATION_STATUS.RUNNING;
    updates.startedAt = updates.startedAt || new Date();
    await elevatorSimulationService.updateSimulation(updates);
    simulationScheduler.restart();
  } else if (action === "pause") {
    updates.status = SIMULATION_STATUS.PAUSED;
    await elevatorSimulationService.updateSimulation(updates);
  } else if (action === "stop") {
    updates.status = SIMULATION_STATUS.STOPPED;
    await elevatorSimulationService.updateSimulation(updates);
    simulationScheduler.stop();
  } else if (action === "reset") {
    updates.status = SIMULATION_STATUS.PAUSED;
    await elevatorSimulationService.updateSimulation(updates);
    await elevatorSimulationService.reset();
  }

  const snapshot = await elevatorSimulationService.getSnapshot();
  res.json({ success: true, ...snapshot });
});
