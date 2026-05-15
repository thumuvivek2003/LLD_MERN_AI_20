import { elevatorRepository } from "../repository/ElevatorRepository.js";
import { requestRepository } from "../repository/RequestRepository.js";
import { SimulationModel } from "../model/simulation.model.js";
import { ElevatorFactory } from "../factory/ElevatorFactory.js";
import { elevatorMovementService } from "./ElevatorMovementService.js";
import { elevatorDispatchService } from "./ElevatorDispatchService.js";
import { requestService } from "./RequestService.js";
import { ELEVATOR_STATE } from "../../../shared/constants/elevatorState.js";
import { ELEVATOR_EVENT, SIMULATION_STATUS } from "../../../shared/constants/elevatorEvent.js";
import { elevatorEventBus } from "../events/ElevatorEventBus.js";
import { env } from "../../../config/env.js";
import { logger } from "../../../shared/utils/logger.js";
import { toResponse } from "../mapper/elevator.mapper.js";

class ElevatorSimulationService {
  constructor() {
    this.elevators = [];
    this.simulation = null;
  }

  async initialize() {
    let sim = await SimulationModel.findOne();
    if (!sim) {
      sim = await SimulationModel.create({
        status: SIMULATION_STATUS.PAUSED,
        speed: 1,
        totalFloors: env.TOTAL_FLOORS,
        totalElevators: env.TOTAL_ELEVATORS,
        strategyName: "NEAREST",
      });
    }
    this.simulation = sim;
    elevatorDispatchService.setStrategy(sim.strategyName);

    const existing = await elevatorRepository.findAll();
    if (existing.length === 0) {
      for (let i = 1; i <= sim.totalElevators; i++) {
        const id = `E${i}`;
        await elevatorRepository.upsert({
          elevatorId: id,
          currentFloor: 0,
          state: ELEVATOR_STATE.IDLE,
          direction: "NONE",
          doorState: "CLOSED",
          requestQueue: [],
          capacity: 8,
        });
        this.elevators.push(ElevatorFactory.createElevator({ elevatorId: id }));
      }
    } else {
      this.elevators = existing.map((d) => ElevatorFactory.fromMongo(d));
    }
    await this.dispatchPendingRequests();
    logger.info(`Simulation initialized with ${this.elevators.length} elevators`);
  }

  async dispatchPendingRequests() {
    const pending = await requestRepository.getPendingRequests();
    for (const req of pending) {
      if (req.type === "HALL") {
        const elevator = await this.dispatchHallRequest(req);
        if (elevator && req.destinationFloor !== null && req.destinationFloor !== undefined) {
          this.dispatchCabinRequest(elevator.elevatorId, req.destinationFloor);
        }
      } else if (req.type === "CABIN" && req.assignedElevatorId && req.destinationFloor !== null) {
        this.dispatchCabinRequest(req.assignedElevatorId, req.destinationFloor);
      }
    }
  }

  getElevatorById(elevatorId) {
    return this.elevators.find((e) => e.elevatorId === elevatorId);
  }

  isRunning() {
    return this.simulation?.status === SIMULATION_STATUS.RUNNING;
  }

  async tick() {
    if (!this.isRunning()) return;
    for (const elevator of this.elevators) {
      const prevState = elevator.state;
      elevatorMovementService.advance(elevator);
      if (elevator.state === ELEVATOR_STATE.OPENING && prevState !== ELEVATOR_STATE.OPENING) {
        await requestService.completeRequestsAtFloor(elevator.elevatorId, elevator.currentFloor);
      }
      await elevatorRepository.upsert({
        elevatorId: elevator.elevatorId,
        currentFloor: elevator.currentFloor,
        direction: elevator.direction,
        state: elevator.state,
        doorState: elevator.doorState,
        requestQueue: [...elevator.requestQueue],
        capacity: elevator.capacity,
      });
    }
    await this.broadcastSnapshot();
  }

  async dispatchHallRequest(requestDoc) {
    const elevator = elevatorDispatchService.dispatchHall(this.elevators, requestDoc);
    if (elevator) {
      await requestRepository.markAssigned(requestDoc._id, elevator.elevatorId);
    }
    return elevator;
  }

  dispatchCabinRequest(elevatorId, destinationFloor) {
    const elevator = this.getElevatorById(elevatorId);
    if (!elevator) return null;
    return elevatorDispatchService.dispatchCabin(elevator, destinationFloor);
  }

  async updateSimulation(updates) {
    // findOneAndUpdate with upsert keeps the singleton resilient against the doc
    // being wiped out-of-band (e.g. `npm run seed` while the server is running).
    this.simulation = await SimulationModel.findOneAndUpdate(
      {},
      { $set: updates },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    if (updates.strategyName) {
      elevatorDispatchService.setStrategy(updates.strategyName);
    }
    return this.simulation;
  }

  async reset() {
    await requestRepository.deleteMany({});
    for (const e of this.elevators) {
      e.currentFloor = 0;
      e.direction = "NONE";
      e.state = ELEVATOR_STATE.IDLE;
      e.doorState = "CLOSED";
      e.requestQueue = [];
      e.interruptClose = false;
      await elevatorRepository.upsert({
        elevatorId: e.elevatorId,
        currentFloor: 0,
        direction: "NONE",
        state: ELEVATOR_STATE.IDLE,
        doorState: "CLOSED",
        requestQueue: [],
        capacity: e.capacity,
      });
    }
    elevatorEventBus.eventLogs = [];
    elevatorEventBus.publish(ELEVATOR_EVENT.EVENT_LOG, {
      type: "SIMULATION_RESET",
      message: "Simulation reset to initial state",
      timestamp: new Date().toISOString(),
    });
    await this.broadcastSnapshot();
  }

  async getSnapshot() {
    const activeRequests = await requestRepository.findActiveRequests();
    const totalRequests = await requestRepository.model.countDocuments();
    const completed = Math.max(0, totalRequests - activeRequests.length);
    const peopleInside = this.elevators.reduce(
      (sum, e) => sum + (e.requestQueue?.length || 0),
      0
    );
    const efficiency = totalRequests > 0 ? Math.round((completed / totalRequests) * 100) : 100;
    return {
      simulation: this.simulation
        ? {
            status: this.simulation.status,
            speed: this.simulation.speed,
            totalFloors: this.simulation.totalFloors,
            totalElevators: this.simulation.totalElevators,
            strategyName: this.simulation.strategyName,
            startedAt: this.simulation.startedAt,
          }
        : null,
      elevators: this.elevators.map(toResponse),
      activeRequests: activeRequests.map((r) => requestService.toPayload(r)),
      eventLogs: elevatorEventBus.getRecentLogs(50),
      stats: {
        peopleInside,
        activeRequests: activeRequests.length,
        totalRequests,
        efficiency,
      },
    };
  }

  async broadcastSnapshot() {
    const snapshot = await this.getSnapshot();
    elevatorEventBus.publish(ELEVATOR_EVENT.SIMULATION_TICK, snapshot);
  }
}

export const elevatorSimulationService = new ElevatorSimulationService();
