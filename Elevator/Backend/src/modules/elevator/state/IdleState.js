import { BaseState } from "../../../shared/base/BaseState.js";
import { ELEVATOR_STATE } from "../../../shared/constants/elevatorState.js";
import { DIRECTION } from "../../../shared/constants/direction.js";

export class IdleState extends BaseState {
  getName() {
    return ELEVATOR_STATE.IDLE;
  }

  handleRequest(targetFloor) {
    if (!this.elevator.requestQueue.includes(targetFloor)) {
      this.elevator.requestQueue.push(targetFloor);
    }
  }

  next() {
    const target = this.elevator.requestQueue[0];
    if (target === undefined) {
      this.elevator.direction = DIRECTION.NONE;
      return ELEVATOR_STATE.IDLE;
    }
    if (target === this.elevator.currentFloor) {
      return ELEVATOR_STATE.OPENING;
    }
    if (target > this.elevator.currentFloor) {
      this.elevator.direction = DIRECTION.UP;
      return ELEVATOR_STATE.MOVING_UP;
    }
    this.elevator.direction = DIRECTION.DOWN;
    return ELEVATOR_STATE.MOVING_DOWN;
  }
}
