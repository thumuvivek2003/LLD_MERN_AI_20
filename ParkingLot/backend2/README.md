# Parking Lot — Backend

Node.js + Express + MongoDB API for the Parking Lot Management System.
Built with clean layering and the design patterns the LLD asks for.

---

## Run it

```bash
cd backend2
npm install

# .env
# PORT=3000
# MONGODB_URI=mongodb://localhost:27017/parking_lot
# JWT_SECRET=change-me
# JWT_EXPIRES_IN=1d

npm run seed     # optional — seeds an admin + a sample lot
npm run dev      # http://localhost:3000
```

Health check: `GET /health` → `{ ok: true }`

---

## Layering

```
routes/           HTTP shape only — calls a controller
controllers/      Parses req/res — calls a service
services/         Business rules — orchestrates repos + strategies + states
strategies/       Pluggable algorithms (allocation, pricing)
states/           Slot lifecycle (Available / Occupied / Maintenance)
factories/        Build vehicles + strategies from input
repositories/     Mongo access — only place that touches the DB
entities/         Domain objects (Mongoose schemas)
middlewares/      auth, role, validate, error
validators/       Per-route input shape
config/           env + DB connect
```

Each layer depends only on the one below it.
Controllers never touch repositories. Services never touch `req`/`res`.

---

## Patterns at a glance

| Pattern              | Where                                 | Why                              |
| -------------------- | ------------------------------------- | -------------------------------- |
| **Strategy**         | `strategies/allocation`, `pricing`    | Swap slot pick / fare rule       |
| **State**            | `states/slot/*`                       | Slot transitions are state-aware |
| **Factory**          | `factories/StrategyFactory`, `Vehicle`| Build by type, hide construction |
| **Repository**       | `repositories/*`                      | DB stays out of services         |
| **Dependency Inj.**  | `app.js` wires everything             | Easy to test / swap              |
| **Middleware Chain** | `auth → role → validate → handler`    | Cross-cutting concerns           |

---

## Request flow

```mermaid
flowchart LR
  C[Client] --> R[Route]
  R --> M{Middlewares}
  M -->|auth| M2[role check]
  M2 -->|valid?| Ctl[Controller]
  Ctl --> Svc[Service]
  Svc --> Strat[Strategy / State]
  Svc --> Repo[Repository]
  Repo --> DB[(MongoDB)]
  DB --> Repo --> Svc --> Ctl --> C
```

---

## Domain model

```mermaid
classDiagram
  class ParkingLot { id; name; address; floors[] }
  class ParkingFloor { id; number; slots[] }
  class ParkingSlot { id; code; type; state }
  class Vehicle { plate; type }
  class Ticket { id; vehicle; slot; entryTime; status }
  class Payment { id; ticket; amount; method; status }
  class User { email; passwordHash; role }

  ParkingLot "1" --> "*" ParkingFloor
  ParkingFloor "1" --> "*" ParkingSlot
  ParkingSlot "1" --> "0..1" Ticket
  Ticket "1" --> "0..1" Payment
  Ticket "1" --> "1" Vehicle
```

---

## Slot lifecycle (State pattern)

```mermaid
stateDiagram-v2
  [*] --> AVAILABLE
  AVAILABLE --> OCCUPIED: park()
  OCCUPIED --> AVAILABLE: free()
  AVAILABLE --> MAINTENANCE: setMaintenance(true)
  MAINTENANCE --> AVAILABLE: setMaintenance(false)
```

Each state lives in `states/slot/*State.js` and only allows its own legal moves.
Illegal transitions (`park()` on `MAINTENANCE`) throw — services don’t need `if`-ladders.

---

## Entry & exit flows

```mermaid
sequenceDiagram
  participant U as Attendant
  participant API as Express
  participant E as EntryService
  participant SF as StrategyFactory
  participant Slot as SlotService
  participant Tk as TicketService

  U->>API: POST /api/entry { plate, type, strategy }
  API->>E: park(payload)
  E->>SF: build(strategy)
  SF-->>E: NearestSlotStrategy
  E->>Slot: allocate(strategy)
  Slot-->>E: slot
  E->>Tk: open(vehicle, slot)
  Tk-->>API: ticket
  API-->>U: 201 ticket
```

```mermaid
sequenceDiagram
  participant U as Attendant
  participant API as Express
  participant X as ExitService
  participant Tk as TicketRepo
  participant P as PricingService
  participant S as SlotService
  participant Pay as PaymentRepo

  U->>API: POST /api/exit { ticketId, method }
  API->>X: exit(payload)
  X->>Tk: findActive(ticketId)
  X->>P: calculate(ticket)
  P-->>X: fare
  X->>Pay: record(fare, method)
  X->>S: free(slot)
  X-->>API: { ticket, payment }
  API-->>U: 200
```

---

## API surface

| Method | Path                                | Role        | Purpose                |
| ------ | ----------------------------------- | ----------- | ---------------------- |
| POST   | `/api/auth/register`                | public      | Create user            |
| POST   | `/api/auth/login`                   | public      | Get JWT                |
| GET    | `/api/lots`                         | any         | List lots              |
| GET    | `/api/lots/:id`                     | any         | Lot details            |
| GET    | `/api/slots/lot/:lotId`             | any         | Slots in a lot         |
| POST   | `/api/admin/lots`                   | ADMIN       | Create lot             |
| POST   | `/api/admin/slots`                  | ADMIN       | Add slot               |
| PATCH  | `/api/admin/slots/:slotId/maintenance` | ADMIN    | Toggle maintenance     |
| POST   | `/api/entry`                        | ADMIN/ATT.  | Park vehicle, get ticket |
| POST   | `/api/exit`                         | ADMIN/ATT.  | Calculate fare, exit   |

All non-public routes require `Authorization: Bearer <token>`.

---

## Layout

```
src/
├── app.js                  # buildApp() — DI wiring
├── server.js               # boot
├── config/                 # env, db
├── controllers/            # thin HTTP handlers
├── services/               # business logic
├── repositories/           # mongo access
├── entities/               # mongoose schemas
├── enums/                  # roles, statuses, types
├── factories/              # builders
├── strategies/
│   ├── allocation/         # Nearest, FirstAvailable, Random
│   └── pricing/            # Weekday, Weekend, Flat
├── states/slot/            # Available, Occupied, Maintenance
├── middlewares/            # auth, role, validate, error
├── validators/             # input shape per route
└── routes/                 # express routers per resource
```
