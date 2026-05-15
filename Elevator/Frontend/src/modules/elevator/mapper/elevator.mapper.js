export function mapElevatorDto(dto = {}) {
  const queue = Array.isArray(dto.requestQueue)
    ? dto.requestQueue
    : Array.isArray(dto.queue)
    ? dto.queue
    : [];
  return {
    id: dto.elevatorId ?? dto.id,
    currentFloor: dto.currentFloor ?? 0,
    direction: dto.direction ?? 'NONE',
    state: dto.state ?? 'IDLE',
    doorState: dto.doorState ?? 'CLOSED',
    queue,
    online: dto.online ?? true,
    peopleInside: dto.peopleInside ?? 0,
    nextStop: queue[0] ?? dto.nextStop ?? null,
  };
}

export function mapRequestDto(dto = {}) {
  return {
    id: dto.id,
    type: dto.type,
    fromFloor: dto.sourceFloor ?? dto.fromFloor ?? dto.floor,
    toFloor: dto.destinationFloor ?? dto.toFloor ?? null,
    direction: dto.direction ?? 'NONE',
    assignedElevatorId: dto.assignedElevatorId ?? null,
    etaSeconds: dto.etaSeconds ?? null,
    status: dto.status ?? 'PENDING',
    createdAt: dto.createdAt || new Date().toISOString(),
  };
}

export function mapEventLogDto(log = {}) {
  return {
    id: log.id || `${log.timestamp || Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: log.timestamp || new Date().toISOString(),
    message: log.message || '',
    level: log.level || 'info',
    elevatorId: log.elevatorId ?? null,
  };
}

export function mapSnapshotDto(dto = {}) {
  const rawRequests = dto.activeRequests ?? dto.requests ?? [];
  return {
    elevators: (dto.elevators || []).map(mapElevatorDto),
    requests: rawRequests.map(mapRequestDto),
    eventLogs: (dto.eventLogs || []).map(mapEventLogDto),
    stats: dto.stats || {
      peopleInside: 0,
      activeRequests: rawRequests.length,
      totalRequests: 0,
      efficiency: 0,
    },
    simulation: dto.simulation || { status: 'PAUSED', speed: 1 },
  };
}
