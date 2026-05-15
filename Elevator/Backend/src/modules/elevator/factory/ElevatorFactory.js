import { ELEVATOR_STATE } from "../../../shared/constants/elevatorState.js";
import { DIRECTION } from "../../../shared/constants/direction.js";

export class ElevatorFactory {
  static createElevator({ elevatorId, currentFloor = 0, capacity = 8 }) {
    return {
      elevatorId,
      currentFloor,
      direction: DIRECTION.NONE,
      state: ELEVATOR_STATE.IDLE,
      doorState: "CLOSED",
      requestQueue: [],
      capacity,
      interruptClose: false,
    };
  }

  static fromMongo(doc) {
    return {
      elevatorId: doc.elevatorId,
      currentFloor: doc.currentFloor,
      direction: doc.direction,
      state: doc.state,
      doorState: doc.doorState,
      requestQueue: [...(doc.requestQueue || [])],
      capacity: doc.capacity,
      interruptClose: false,
    };
  }
}
