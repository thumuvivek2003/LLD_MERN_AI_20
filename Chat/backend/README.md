# Chat MVP — Backend

A minimal WhatsApp-style real-time chat backend built for LLD learning.
Node.js + Express + MongoDB (Mongoose) + Socket.IO, ESM only.

This implementation conforms to `../API_CONTRACT.md` (REST routes,
response envelopes, socket events).

---

## Quick start

```bash
cd Chat/backend
npm install
npm run dev      # nodemon
# or
npm start        # plain node
```

The server listens on `http://localhost:5000` and exposes Socket.IO at
the same origin. CORS is open for `http://localhost:5173`.

If MongoDB isn't running locally, the server still boots and prints a
friendly warning. Start mongo with:

```bash
brew services start mongodb-community
# or
docker run -p 27017:27017 -d --name chat-mongo mongo:7
```

---

## Environment variables

See `.env.example`. Defaults in `.env`:

| Var | Default | Notes |
|---|---|---|
| `PORT` | `5000` | HTTP/Socket.IO port |
| `MONGO_URI` | `mongodb://localhost:27017/chat_mvp` | Mongo connection |
| `JWT_SECRET` | dev value | replace in real envs |
| `JWT_EXPIRES_IN` | `7d` |  |
| `CLIENT_ORIGIN` | `http://localhost:5173` | CORS origin |
| `DEV_FIXED_OTP` | `123456` | OTP shortcut |

---

## Auth shortcut (MVP)

- `POST /api/auth/login` always returns the dev OTP (`123456`). It is
  included in the response payload so the frontend can display it for
  one-click login during development.
- `POST /api/auth/verify-otp` accepts that fixed OTP, creates the user
  if they don't exist (default name `User-<last4mobile>`), and issues a
  JWT.
- Seeded admin: **mobile `9999999999` / OTP `123456`** — admin role is
  applied automatically.

---

## Architecture (high level)

```
Client (REST + Socket.IO)
    ↓
Express controllers
    ↓
Services (business logic, transactions)
    ↓
Repositories (Mongoose access)
    ↓
MongoDB

Side channel:
Services → EventBus (in-memory pub/sub) → Subscribers
                                          ├─ socket.subscriber       (emit to clients)
                                          ├─ delivery.subscriber     (auto-mark DELIVERED)
                                          ├─ presence.subscriber     (online backfill)
                                          └─ message-created.subscriber (audit/log)
```

### Patterns used

| Pattern | Location |
|---|---|
| Repository | `modules/<feature>/<feature>.repository.js` |
| Service | `modules/<feature>/<feature>.service.js` |
| Factory | `modules/chat/chat.factory.js` (DIRECT vs GROUP creation) |
| Strategy | `modules/message/strategies/{direct,group,offline}-message.strategy.js` |
| State | `modules/message/states/{sent,delivered,read}.state.js` |
| Singleton | `modules/socket/socket.manager.js`, `events/event-bus.js` |
| Observer / Pub-Sub | `events/event-bus.js` + `events/subscribers/*` |
| Mapper / DTO | `*.mapper.js` per module |

### Message lifecycle (`SENT → DELIVERED → READ`)

1. `POST /api/messages` (or socket `message:send`) → `MessageService.createMessage()`.
2. Strategy generates per-member `MessageStatus` rows (sender = `READ`, others = `SENT`).
3. `MESSAGE_CREATED` is published. `socket.subscriber` emits `message:new` to recipients. `delivery.subscriber` checks who is online via `SocketManager` and flips their status to `DELIVERED`, which publishes `MESSAGE_DELIVERED` → `message:delivered` is emitted.
4. When the recipient reads (`PATCH /api/messages/:id/read` or `chat:read-all`), `DeliveryService` transitions through the State pattern and publishes `MESSAGE_READ`.
5. Aggregated status (shown to sender):
   - DIRECT: the recipient's status.
   - GROUP: `min(status)` across all recipients where `SENT < DELIVERED < READ`.

### Presence

- `SocketManager` tracks `userId → Set<socketId>`. A user is online iff at least one socket is connected.
- On first socket connect: user `isOnline=true`, broadcast `presence:online`, snapshot of online users sent to the connecting client.
- On last socket disconnect: user `isOnline=false`, `lastSeen=now`, broadcast `presence:offline`.

---

## REST endpoints (cheat sheet)

All under `/api`. Auth header: `Authorization: Bearer <jwt>`.

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/auth/login` | – | Returns dev OTP |
| POST | `/auth/verify-otp` | – | Returns `{ token, user }` |
| POST | `/auth/logout` | JWT | |
| GET | `/users/me` | JWT | |
| PATCH | `/users/me` | JWT | `{ name }` |
| GET | `/users` | JWT | Contacts (all except self) |
| GET | `/users/:id` | JWT | |
| GET | `/chats` | JWT | User's chat list |
| POST | `/chats/direct` | JWT | `{ userId }` (idempotent) |
| POST | `/chats/group` | JWT | `{ name, memberIds[] }` |
| GET | `/chats/:chatId` | JWT | |
| GET | `/messages/:chatId` | JWT | `?limit&before` |
| POST | `/messages` | JWT | `{ chatId, content, tempId }` |
| PATCH | `/messages/:messageId/read` | JWT | |
| PATCH | `/messages/:chatId/read-all` | JWT | |
| POST | `/groups/:chatId/members` | JWT (ADMIN of group) | |
| DELETE | `/groups/:chatId/members/:userId` | JWT (ADMIN of group) | |
| PATCH | `/groups/:chatId` | JWT (ADMIN of group) | `{ name }` |
| GET | `/admin/stats` | JWT (ADMIN role) | |
| GET | `/admin/users` | JWT (ADMIN role) | |
| GET | `/admin/users/:id` | JWT (ADMIN role) | |
| PATCH | `/admin/users/:id/block` | JWT (ADMIN role) | |
| PATCH | `/admin/users/:id/unblock` | JWT (ADMIN role) | |
| GET | `/admin/groups` | JWT (ADMIN role) | |

Socket.IO contract is documented in `../API_CONTRACT.md`.

---

## Notes / deliberate scope limits

- Single-process, in-memory `EventBus` and `SocketManager`. No Redis.
- OTP is the fixed dev value (`123456`); production would use SMS + TTL.
- No media uploads, reactions, replies, search.
