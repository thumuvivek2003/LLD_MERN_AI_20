# Auction System — Backend (MVP)

LLD-focused Node/Express/Mongo backend. Strong domain modelling, five well-placed patterns, real concurrency handling.

## Install & run

```bash
cp .env.example .env       # adjust if needed
npm install
npm run dev                # nodemon
# or
npm start
```

Requires Node 20+ and a running MongoDB at `MONGO_URI`.

## Environment

```
PORT=5001
MONGO_URI=mongodb://localhost:27017/auction_mvp
JWT_SECRET=change_me
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

## Seeded users (auto-created on first boot if collection is empty)

| Role      | Email               | Password    | Wallet |
| --------- | ------------------- | ----------- | ------ |
| ADMIN     | admin@auction.com   | Admin@123   | 0      |
| MEMBER    | alice@auction.com   | Member@123  | 50010  |
| MEMBER    | bob@auction.com     | Member@123  | 50010  |
| SPECTATOR | eve@auction.com     | Specta@123  | 0      |

Run standalone if needed: `npm run seed`.

## REST endpoints

All responses are wrapped as `{ success, data }` / `{ success: false, message, code? }`.

### Auth
- `POST /api/auth/register` `{ name, email, password, role? }` → `{ user, token }`
- `POST /api/auth/login`    `{ email, password }`             → `{ user, token }`
- `GET  /api/auth/me`       (Bearer)                          → `{ user }`

### Users (ADMIN)
- `GET /api/users`
- `GET /api/users/members`

### Wallet (auth)
- `GET  /api/wallet`        → `{ balance }`
- `POST /api/wallet/topup`  `{ amount }` → `{ balance }`

### Auctions
- `POST /api/auctions`              (ADMIN)  body per contract
- `GET  /api/auctions`              (public) `?status&page&limit`
- `GET  /api/auctions/live`         (public)
- `GET  /api/auctions/:id`          (public) → `{ auction, bids }`
- `POST /api/auctions/:id/close`    (ADMIN)
- `POST /api/auctions/:id/assign`   (ADMIN)  `{ userIds }`
- `GET  /api/auctions/me/bids`      (MEMBER)
- `GET  /api/auctions/me/wins`      (MEMBER)

### Bids
- `POST /api/auctions/:id/bids` (MEMBER) `{ amount }` → `{ bid, auction }`
- `GET  /api/auctions/:id/bids` (public) → `{ bids }`

## Socket.IO

Connect to the same `http://localhost:PORT`.

Client → Server:
- `auction:join`  `{ auctionId }`
- `auction:leave` `{ auctionId }`

Server → room `auction:<id>`:
- `auction:started` `{ auctionId }`
- `auction:closed`  `{ auctionId, winnerId, winnerName, finalAmount }`
- `bid:new`         `{ auctionId, amount, bidderId, bidderName, timestamp }`

## The five patterns and where they live

| Pattern                 | Where                                                                                                                                                    |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| State                   | `src/modules/auction/states/` — `BaseAuctionState`, `ScheduledAuctionState`, `OpenAuctionState`, `ClosedAuctionState`, `CancelledAuctionState` + factory |
| Chain of Responsibility | `src/modules/auction/validators/bidValidators/*` wired by `bidValidationChain.builder.js`                                                                |
| Strategy                | `src/modules/auction/strategies/incrementStrategies/*` + `strategyFactory.js`                                                                            |
| Pub/Sub (Observer)      | `src/shared/eventBus/eventBus.singleton.js` + `src/modules/auction/subscribers/{liveBid,auctionClose,auditLog}.subscriber.js`                            |
| Repository              | `src/modules/*/repositories/*.repository.js` — services never touch mongoose directly                                                                    |

## Concurrency model

1. `auctionLockManager.lock(auctionId, fn)` serialises operations for a single auction id within this process (per-key async mutex).
2. Inside the lock, the bid service runs the validation chain, then performs an optimistic update keyed on `{ _id, version }`. The update increments `version`.
3. On version mismatch, the service retries up to 3 times before returning 409.

For multi-process / multi-node deployments, swap the lock manager for a Redis/Redlock implementation; the rest of the code is unaffected.
