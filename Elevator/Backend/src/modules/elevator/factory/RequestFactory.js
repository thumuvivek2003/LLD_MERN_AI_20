import { REQUEST_TYPE } from "../../../shared/constants/requestType.js";
import { DIRECTION } from "../../../shared/constants/direction.js";

export class RequestFactory {
  static createHallRequest({ sourceFloor, direction, destinationFloor = null }) {
    return {
      sourceFloor,
      destinationFloor,
      direction,
      type: REQUEST_TYPE.HALL,
    };
  }

  static createCabinRequest({ elevatorId, currentFloor, destinationFloor }) {
    const direction =
      destinationFloor > currentFloor
        ? DIRECTION.UP
        : destinationFloor < currentFloor
        ? DIRECTION.DOWN
        : DIRECTION.NONE;
    return {
      sourceFloor: currentFloor,
      destinationFloor,
      direction,
      type: REQUEST_TYPE.CABIN,
      assignedElevatorId: elevatorId,
    };
  }
}
