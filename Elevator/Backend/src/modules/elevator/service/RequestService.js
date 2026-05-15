import { requestRepository } from "../repository/RequestRepository.js";
import { RequestFactory } from "../factory/RequestFactory.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { ELEVATOR_EVENT } from "../../../shared/constants/elevatorEvent.js";
import { elevatorEventBus } from "../events/ElevatorEventBus.js";

class RequestService {
  validateFloor(floor, totalFloors) {
    if (floor < 0 || floor >= totalFloors) {
      throw new AppError(`Floor ${floor} out of range [0..${totalFloors - 1}]`, 400);
    }
  }

  async createHallRequest({ sourceFloor, direction, destinationFloor }, totalFloors) {
    this.validateFloor(sourceFloor, totalFloors);
    if (destinationFloor !== null && destinationFloor !== undefined) {
      this.validateFloor(destinationFloor, totalFloors);
    }
    const data = RequestFactory.createHallRequest({ sourceFloor, direction, destinationFloor });
    const doc = await requestRepository.create(data);
    this.emitCreated(doc);
    return doc;
  }

  async createCabinRequest({ elevatorId, currentFloor, destinationFloor }, totalFloors) {
    this.validateFloor(destinationFloor, totalFloors);
    const data = RequestFactory.createCabinRequest({ elevatorId, currentFloor, destinationFloor });
    const doc = await requestRepository.create(data);
    this.emitCreated(doc);
    return doc;
  }

  async completeRequestsAtFloor(elevatorId, floor) {
    const active = await requestRepository.findActiveRequests();
    const toComplete = active.filter((r) => {
      if (r.type === "CABIN") {
        return r.assignedElevatorId === elevatorId && r.destinationFloor === floor;
      }
      if (r.assignedElevatorId && r.assignedElevatorId !== elevatorId) return false;
      if (r.destinationFloor !== null && r.destinationFloor !== undefined) {
        return r.destinationFloor === floor || r.sourceFloor === floor;
      }
      return r.sourceFloor === floor;
    });
    for (const r of toComplete) {
      const updated = await requestRepository.markCompleted(r._id);
      elevatorEventBus.publish(ELEVATOR_EVENT.REQUEST_COMPLETED, this.toPayload(updated));
    }
    return toComplete;
  }

  emitCreated(doc) {
    elevatorEventBus.publish(ELEVATOR_EVENT.REQUEST_CREATED, this.toPayload(doc));
  }

  toPayload(doc) {
    return {
      id: doc._id?.toString(),
      sourceFloor: doc.sourceFloor,
      destinationFloor: doc.destinationFloor,
      direction: doc.direction,
      type: doc.type,
      status: doc.status,
      assignedElevatorId: doc.assignedElevatorId,
      createdAt: doc.createdAt,
      completedAt: doc.completedAt,
    };
  }
}

export const requestService = new RequestService();
