import { BaseState } from "../../../shared/base/BaseState.js";
import { ELEVATOR_STATE } from "../../../shared/constants/elevatorState.js";
import { DIRECTION } from "../../../shared/constants/direction.js";

export class MovingUpState extends BaseState {
  getName() {
    return ELEVATOR_STATE.MOVING_UP;
  }

  handleRequest(targetFloor) {
    if (!this.elevator.requestQueue.includes(targetFloor)) {
      this.elevator.requestQueue.push(targetFloor);
      this.elevator.requestQueue.sort((a, b) => a - b);
    }
  }

  next() {
    this.elevator.direction = DIRECTION.UP;
    this.elevator.currentFloor += 1;
    if (this.elevator.requestQueue.includes(this.elevator.currentFloor)) {
      return ELEVATOR_STATE.OPENING;
    }
    return ELEVATOR_STATE.MOVING_UP;
  }
}
