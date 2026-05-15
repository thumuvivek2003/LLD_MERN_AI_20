import { ElevatorStateFactory } from "../state/ElevatorStateFactory.js";
import { ELEVATOR_STATE } from "../../../shared/constants/elevatorState.js";
import { DIRECTION } from "../../../shared/constants/direction.js";
import { ELEVATOR_EVENT } from "../../../shared/constants/elevatorEvent.js";
import { elevatorEventBus } from "../events/ElevatorEventBus.js";

class ElevatorMovementService {
  advance(elevator) {
    const stateInstance = ElevatorStateFactory.createState(elevator.state, elevator);
    const prevState = elevator.state;
    const prevFloor = elevator.currentFloor;
    const nextStateName = stateInstance.next();
    elevator.state = nextStateName;

    if (prevState !== nextStateName || prevFloor !== elevator.currentFloor) {
      this.logTransition(elevator, prevState, prevFloor);
    }

    elevatorEventBus.publish(ELEVATOR_EVENT.ELEVATOR_UPDATE, {
      elevatorId: elevator.elevatorId,
      currentFloor: elevator.currentFloor,
      direction: elevator.direction,
      state: elevator.state,
      doorState: elevator.doorState,
      requestQueue: [...elevator.requestQueue],
    });
  }

  moveUp(elevator) {
    elevator.currentFloor += 1;
    elevator.direction = DIRECTION.UP;
  }

  moveDown(elevator) {
    elevator.currentFloor -= 1;
    elevator.direction = DIRECTION.DOWN;
  }

  stopAtFloor(elevator) {
    elevator.state = ELEVATOR_STATE.OPENING;
  }

  processNextDestination(elevator) {
    if (!elevator.requestQueue.length) {
      elevator.state = ELEVATOR_STATE.IDLE;
      elevator.direction = DIRECTION.NONE;
    }
  }

  logTransition(elevator, prevState, prevFloor) {
    const msg =
      prevFloor !== elevator.currentFloor
        ? `${elevator.elevatorId} moved ${prevFloor} → ${elevator.currentFloor} (${elevator.state})`
        : `${elevator.elevatorId} ${prevState} → ${elevator.state} at floor ${elevator.currentFloor}`;
    elevatorEventBus.publish(ELEVATOR_EVENT.EVENT_LOG, {
      type: "ELEVATOR_TICK",
      message: msg,
      elevatorId: elevator.elevatorId,
      floor: elevator.currentFloor,
      timestamp: new Date().toISOString(),
    });
  }
}

export const elevatorMovementService = new ElevatorMovementService();
