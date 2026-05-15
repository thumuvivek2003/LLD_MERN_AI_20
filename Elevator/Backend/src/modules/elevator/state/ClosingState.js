import { BaseState } from "../../../shared/base/BaseState.js";
import { ELEVATOR_STATE } from "../../../shared/constants/elevatorState.js";
import { DIRECTION } from "../../../shared/constants/direction.js";

export class ClosingState extends BaseState {
  getName() {
    return ELEVATOR_STATE.CLOSING;
  }

  // Closing is interruptible: a new request at the current floor must reopen the doors
  // before they finish closing — otherwise riders would be stuck waiting a full cycle.
  handleRequest(targetFloor) {
    if (targetFloor === this.elevator.currentFloor) {
      this.elevator.interruptClose = true;
      return;
    }
    if (!this.elevator.requestQueue.includes(targetFloor)) {
      this.elevator.requestQueue.push(targetFloor);
    }
  }

  next() {
    if (this.elevator.interruptClose) {
      this.elevator.interruptClose = false;
      this.elevator.doorState = "OPEN";
      return ELEVATOR_STATE.OPENING;
    }
    this.elevator.doorState = "CLOSED";
    this.elevator.requestQueue = this.elevator.requestQueue.filter(
      (f) => f !== this.elevator.currentFloor
    );
    if (this.elevator.requestQueue.length === 0) {
      this.elevator.direction = DIRECTION.NONE;
      return ELEVATOR_STATE.IDLE;
    }
    const nextTarget = this.elevator.requestQueue[0];
    if (nextTarget > this.elevator.currentFloor) {
      this.elevator.direction = DIRECTION.UP;
      return ELEVATOR_STATE.MOVING_UP;
    }
    this.elevator.direction = DIRECTION.DOWN;
    return ELEVATOR_STATE.MOVING_DOWN;
  }
}
