import { NearestElevatorStrategy } from "../strategy/NearestElevatorStrategy.js";
import { SameDirectionStrategy } from "../strategy/SameDirectionStrategy.js";
import { LeastBusyStrategy } from "../strategy/LeastBusyStrategy.js";
import { ElevatorStateFactory } from "../state/ElevatorStateFactory.js";
import { ELEVATOR_EVENT } from "../../../shared/constants/elevatorEvent.js";
import { elevatorEventBus } from "../events/ElevatorEventBus.js";

class ElevatorDispatchService {
  constructor() {
    this.strategies = {
      NEAREST: new NearestElevatorStrategy(),
      SAME_DIRECTION: new SameDirectionStrategy(),
      LEAST_BUSY: new LeastBusyStrategy(),
    };
    this.activeStrategy = this.strategies.NEAREST;
  }

  setStrategy(name) {
    if (this.strategies[name]) {
      this.activeStrategy = this.strategies[name];
    }
  }

  getStrategyName() {
    return this.activeStrategy.getName();
  }

  assignElevator(elevators, request) {
    return this.activeStrategy.selectElevator(elevators, request);
  }

  dispatchHall(elevators, request) {
    const elevator = this.assignElevator(elevators, request);
    if (!elevator) return null;
    this.pushTarget(elevator, request.sourceFloor);
    this.log(elevator, `Hall request floor ${request.sourceFloor} (${request.direction}) assigned`);
    return elevator;
  }

  dispatchCabin(elevator, destinationFloor) {
    this.pushTarget(elevator, destinationFloor);
    this.log(elevator, `Cabin request to floor ${destinationFloor} queued`);
    return elevator;
  }

  pushTarget(elevator, floor) {
    const state = ElevatorStateFactory.createState(elevator.state, elevator);
    state.handleRequest(floor);
  }

  log(elevator, message) {
    elevatorEventBus.publish(ELEVATOR_EVENT.EVENT_LOG, {
      type: "DISPATCH",
      message: `${elevator.elevatorId}: ${message}`,
      elevatorId: elevator.elevatorId,
      floor: elevator.currentFloor,
      timestamp: new Date().toISOString(),
    });
  }
}

export const elevatorDispatchService = new ElevatorDispatchService();
