import { ELEVATOR_EVENT } from "../../../shared/constants/elevatorEvent.js";
import { elevatorEventBus } from "../events/ElevatorEventBus.js";

class DoorService {
  openDoor(elevator) {
    elevator.doorState = "OPEN";
    this.log("DOOR_OPEN", `E${elevator.elevatorId} doors opened at floor ${elevator.currentFloor}`, elevator);
  }

  closeDoor(elevator) {
    elevator.doorState = "CLOSED";
    this.log("DOOR_CLOSE", `E${elevator.elevatorId} doors closed at floor ${elevator.currentFloor}`, elevator);
  }

  reopenDoor(elevator) {
    elevator.doorState = "OPEN";
    elevator.interruptClose = false;
    this.log("DOOR_REOPEN", `E${elevator.elevatorId} doors reopened at floor ${elevator.currentFloor}`, elevator);
  }

  log(type, message, elevator) {
    elevatorEventBus.publish(ELEVATOR_EVENT.EVENT_LOG, {
      type,
      message,
      elevatorId: elevator.elevatorId,
      floor: elevator.currentFloor,
      timestamp: new Date().toISOString(),
    });
  }
}

export const doorService = new DoorService();
