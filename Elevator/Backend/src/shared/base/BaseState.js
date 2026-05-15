export class BaseState {
  constructor(elevator) {
    this.elevator = elevator;
  }

  handleRequest(_request) {
    throw new Error("handleRequest() must be overridden");
  }

  next() {
    throw new Error("next() must be overridden");
  }

  getName() {
    throw new Error("getName() must be overridden");
  }
}
