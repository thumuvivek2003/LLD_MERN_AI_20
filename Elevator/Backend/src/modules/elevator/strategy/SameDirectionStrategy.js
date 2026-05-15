import { ElevatorSelectionStrategy } from "./ElevatorSelectionStrategy.js";
import { DIRECTION } from "../../../shared/constants/direction.js";
import { calculateDistance } from "../../../shared/utils/distanceCalculator.js";

export class SameDirectionStrategy extends ElevatorSelectionStrategy {
  getName() {
    return "SAME_DIRECTION";
  }

  selectElevator(elevators, request) {
    if (!elevators.length) return null;
    const sameDirCandidates = elevators.filter((e) => {
      if (e.direction === DIRECTION.NONE) return true;
      if (request.direction === DIRECTION.UP && e.direction === DIRECTION.UP) {
        return e.currentFloor <= request.sourceFloor;
      }
      if (request.direction === DIRECTION.DOWN && e.direction === DIRECTION.DOWN) {
        return e.currentFloor >= request.sourceFloor;
      }
      return false;
    });
    const pool = sameDirCandidates.length ? sameDirCandidates : elevators;
    let best = pool[0];
    let bestDist = calculateDistance(best.currentFloor, request.sourceFloor);
    for (let i = 1; i < pool.length; i++) {
      const d = calculateDistance(pool[i].currentFloor, request.sourceFloor);
      if (d < bestDist) {
        best = pool[i];
        bestDist = d;
      }
    }
    return best;
  }
}
