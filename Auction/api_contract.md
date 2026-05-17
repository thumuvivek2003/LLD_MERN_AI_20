# Auction System — Shared API Contract (Source of Truth)

Both Backend and Frontend MUST follow this contract verbatim.

- Module type: ESM (`"type": "module"`)
- Auth: Bearer JWT in `Authorization: Bearer <token>`
- Base URL (frontend env): `VITE_API_URL=http://localhost:5001`
- Socket URL (frontend env): `VITE_SOCKET_URL=http://localhost:5001`
- All JSON bodies. Errors return `{ success: false, message, code? }`.
- All success bodies wrap data: `{ success: true, data: <payload> }`.

## Domain enums

```
Role:           "ADMIN" | "MEMBER" | "SPECTATOR"
AuctionStatus:  "SCHEDULED" | "OPEN" | "CLOSED" | "CANCELLED"
IncrementType:  "FIXED" | "PERCENTAGE"
```

## REST endpoints

### Auth
- `POST /api/auth/register` — body `{ name, email, password, role? }` → `{ user, token }`
  - role defaults to `MEMBER`; only seeded ADMIN can create ADMIN.
- `POST /api/auth/login` — body `{ email, password }` → `{ user, token }`
- `GET  /api/auth/me` (auth) → `{ user }`

User shape:
```
{ id, name, email, role, walletBalance }
```

### Users (admin)
- `GET  /api/users` (auth, ADMIN) → `{ users: [...] }`
- `GET  /api/users/members` (auth, ADMIN) → only role MEMBER

### Wallet (member)
- `GET  /api/wallet` (auth) → `{ balance }`
- `POST /api/wallet/topup` (auth) body `{ amount }` → `{ balance }`

### Auctions
- `POST /api/auctions` (auth, ADMIN) body:
  ```
  {
    item: { name, description, basePrice, imageUrl? },
    startPrice, startTime, endTime,
    increment: { type: "FIXED"|"PERCENTAGE", value: number },
    eligibleUserIds: [string]
  }
  ```
  → `{ auction }`
- `GET  /api/auctions` (public)         query: `status`, `page`, `limit` → `{ auctions, total }`
- `GET  /api/auctions/live` (public)    → live (OPEN) auctions
- `GET  /api/auctions/:id` (public)     → `{ auction, bids: [...] }`
- `POST /api/auctions/:id/close` (auth, ADMIN) → `{ auction }`
- `POST /api/auctions/:id/assign` (auth, ADMIN) body `{ userIds: [...] }` → `{ auction }`
- `GET  /api/auctions/me/bids` (auth, MEMBER) → `{ auctions }`
- `GET  /api/auctions/me/wins` (auth, MEMBER) → `{ auctions }`

Auction shape:
```
{
  id, item: { name, description, basePrice, imageUrl },
  startPrice, currentHighestBid, highestBidderId, highestBidderName,
  status, startTime, endTime,
  increment: { type, value },
  eligibleUserIds: [string],
  createdBy, createdAt, updatedAt, version
}
```

### Bids
- `POST /api/auctions/:id/bids` (auth, MEMBER) body `{ amount }` → `{ bid, auction }`
- `GET  /api/auctions/:id/bids` (public) → `{ bids: [...] }`

Bid shape:
```
{ id, auctionId, bidderId, bidderName, amount, timestamp }
```

## Socket.IO contract

Namespace: default `/`.
Rooms: `auction:<auctionId>`.

### Client → Server
- `auction:join` `{ auctionId }`
- `auction:leave` `{ auctionId }`

### Server → Client (broadcast to room `auction:<id>`)
- `auction:started` `{ auctionId }`
- `auction:closed`  `{ auctionId, winnerId, winnerName, finalAmount }`
- `bid:new`         `{ auctionId, amount, bidderId, bidderName, timestamp }`

## Validation rules (Chain of Responsibility on backend)

For placing a bid, in order:
1. AuctionOpenValidator       — auction.status === OPEN
2. BidTimeValidator           — now between startTime and endTime
3. EligibleBidderValidator    — user in eligibleUserIds
4. MinimumBidValidator        — amount > currentHighestBid (or >= startPrice)
5. IncrementStrategy          — FIXED (amount - high >= value) or PERCENTAGE (amount >= high * (1 + value/100))
6. WalletValidator            — walletBalance >= amount

On success, atomic update with `version` (optimistic locking) inside an in-memory `AuctionLockManager.lock(id)` critical section. On version mismatch, retry up to 3 times.

Wallet behaviour for MVP: bids reserve nothing; debit happens only when auction closes and winner is settled (simpler). But `walletBalance >= amount` is still validated at bid time.

## Seeded users (for demo)
- Admin: `admin@auction.com / Admin@123`
- Member 1: `alice@auction.com / Member@123`
- Member 2: `bob@auction.com / Member@123`
- Spectator: `eve@auction.com / Specta@123`

## HTTP status codes
- 200 OK / 201 Created / 204 No Content
- 400 Validation / 401 Unauthorized / 403 Forbidden / 404 Not Found
- 409 Conflict (bid race) / 422 Domain rule violation
- 500 Internal

## Frontend route map
- `/login`, `/register`
- `/admin` (ADMIN) → dashboard, `/admin/auctions`, `/admin/auctions/new`, `/admin/auctions/:id`, `/admin/auctions/:id/assign`, `/admin/users`, `/admin/schedule`, `/admin/reports`
- `/member` (MEMBER) → dashboard, `/member/auctions`, `/member/auctions/:id`, `/member/wallet`, `/member/bids`, `/member/wins`, `/member/profile`
- `/spectator` (SPECTATOR or public) → `/spectator`, `/spectator/auctions/:id`

## Tech
- Backend: Node 20+, Express 4, Mongoose 8, Socket.IO 4, jsonwebtoken, bcryptjs, dotenv, node-cron, zod (or Joi)
- Frontend: React 18, Vite, react-router-dom 6, Zustand, axios, socket.io-client, Tailwind 3, react-hot-toast
