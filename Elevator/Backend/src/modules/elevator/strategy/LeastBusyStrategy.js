import { ElevatorSelectionStrategy } from "./ElevatorSelectionStrategy.js";

export class LeastBusyStrategy extends ElevatorSelectionStrategy {
  getName() {
    return "LEAST_BUSY";
  }

  selectElevator(elevators, _request) {
    if (!elevators.length) return null;
    let best = elevators[0];
    for (let i = 1; i < elevators.length; i++) {
      if (elevators[i].requestQueue.length < best.requestQueue.length) {
        best = elevators[i];
      }
    }
    return best;
  }
}
