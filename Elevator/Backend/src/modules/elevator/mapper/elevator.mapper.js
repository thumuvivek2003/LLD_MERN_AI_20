export function toResponse(elevator) {
  return {
    elevatorId: elevator.elevatorId,
    currentFloor: elevator.currentFloor,
    direction: elevator.direction,
    state: elevator.state,
    doorState: elevator.doorState,
    requestQueue: [...elevator.requestQueue],
    capacity: elevator.capacity,
  };
}

export function toSimulationPayload(snapshot) {
  return {
    simulation: snapshot.simulation,
    elevators: snapshot.elevators.map(toResponse),
    activeRequests: snapshot.activeRequests,
    eventLogs: snapshot.eventLogs,
  };
}
