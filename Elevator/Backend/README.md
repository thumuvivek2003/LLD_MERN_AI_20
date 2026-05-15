# Elevator Simulation Backend

Node.js + Express + MongoDB + Socket.io simulation of a multi-elevator building.

## Run
```
npm install
npm run dev
```

Server runs on `PORT` (default 4000).

## Env
- `PORT` HTTP/WS port
- `MONGO_URI` MongoDB connection
- `CLIENT_ORIGIN` CORS allowed origin
- `TICK_INTERVAL_MS` simulation tick interval (default 1000)
- `TOTAL_FLOORS` building floor count (G..N)
- `TOTAL_ELEVATORS` number of elevators

## Architecture
- **State Pattern** (`modules/elevator/state/`) — Idle, MovingUp, MovingDown, Opening, Closing. ClosingState is interruptible: a new request matching `currentFloor` flips it back to Opening before the doors finish closing.
- **Strategy Pattern** (`modules/elevator/strategy/`) — Nearest (default), SameDirection, LeastBusy.
- **Scheduler** (`modules/elevator/scheduler/SimulationScheduler.js`) — setInterval-driven tick singleton.
- **EventBus** (`modules/elevator/events/`) — Node `EventEmitter` wraps state changes; handler broadcasts via Socket.io.
- **Repositories** persist `Simulation`, `Elevator`, `Request` in Mongo; in-memory elevator runtime is rehydrated on boot.

## REST
- `POST /api/elevator/hall-request`
- `POST /api/elevator/cabin-request`
- `GET  /api/elevator/snapshot`
- `POST /api/elevator/simulation/control`
- `GET  /api/health`

## Socket events
`elevator:update`, `request:created`, `request:completed`, `simulation:tick`, `event:log`
