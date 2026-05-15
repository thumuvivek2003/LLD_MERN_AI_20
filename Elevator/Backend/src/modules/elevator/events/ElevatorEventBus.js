import { EventEmitter } from "events";

class ElevatorEventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50);
    this.eventLogs = [];
  }

  publish(eventName, payload) {
    this.emit(eventName, payload);
  }

  appendLog(log) {
    this.eventLogs.push(log);
    if (this.eventLogs.length > 200) this.eventLogs.shift();
  }

  getRecentLogs(limit = 50) {
    return this.eventLogs.slice(-limit);
  }
}

export const elevatorEventBus = new ElevatorEventBus();
