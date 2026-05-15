export class ElevatorSelectionStrategy {
  selectElevator(_elevators, _request) {
    throw new Error("selectElevator() must be overridden");
  }

  getName() {
    throw new Error("getName() must be overridden");
  }
}
