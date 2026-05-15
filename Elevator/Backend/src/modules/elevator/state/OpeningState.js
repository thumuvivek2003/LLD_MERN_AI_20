import { BaseState } from "../../../shared/base/BaseState.js";
import { ELEVATOR_STATE } from "../../../shared/constants/elevatorState.js";

export class OpeningState extends BaseState {
  getName() {
    return ELEVATOR_STATE.OPENING;
  }

  handleRequest(targetFloor) {
    if (!this.elevator.requestQueue.includes(targetFloor)) {
      this.elevator.requestQueue.push(targetFloor);
    }
  }

  next() {
    this.elevator.doorState = "OPEN";
    return ELEVATOR_STATE.CLOSING;
  }
}
