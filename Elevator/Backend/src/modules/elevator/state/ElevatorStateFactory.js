import { ELEVATOR_STATE } from "../../../shared/constants/elevatorState.js";
import { IdleState } from "./IdleState.js";
import { MovingUpState } from "./MovingUpState.js";
import { MovingDownState } from "./MovingDownState.js";
import { OpeningState } from "./OpeningState.js";
import { ClosingState } from "./ClosingState.js";

export class ElevatorStateFactory {
  static createState(name, elevator) {
    switch (name) {
      case ELEVATOR_STATE.IDLE:
        return new IdleState(elevator);
      case ELEVATOR_STATE.MOVING_UP:
        return new MovingUpState(elevator);
      case ELEVATOR_STATE.MOVING_DOWN:
        return new MovingDownState(elevator);
      case ELEVATOR_STATE.OPENING:
        return new OpeningState(elevator);
      case ELEVATOR_STATE.CLOSING:
        return new ClosingState(elevator);
      default:
        throw new Error(`Unknown elevator state: ${name}`);
    }
  }
}
