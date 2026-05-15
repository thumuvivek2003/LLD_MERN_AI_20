import { ElevatorSelectionStrategy } from "./ElevatorSelectionStrategy.js";
import { calculateDistance } from "../../../shared/utils/distanceCalculator.js";

export class NearestElevatorStrategy extends ElevatorSelectionStrategy {
  getName() {
    return "NEAREST";
  }

  selectElevator(elevators, request) {
    if (!elevators.length) return null;
    let best = elevators[0];
    let bestDist = calculateDistance(best.currentFloor, request.sourceFloor);
    for (let i = 1; i < elevators.length; i++) {
      const d = calculateDistance(elevators[i].currentFloor, request.sourceFloor);
      if (d < bestDist) {
        best = elevators[i];
        bestDist = d;
      }
    }
    return best;
  }
}
