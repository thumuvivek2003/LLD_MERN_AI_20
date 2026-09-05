# WhatsApp Status — MVP (MERN + Socket.IO)

A full-stack WhatsApp *Status* clone built as an **LLD learning project**. It follows
the exact design you worked out in [chat.md](chat.md): immutable statuses, insert-only
views, dynamic (non-fan-out) feed generation, privacy strategies, and WhatsApp's
unseen-first feed ordering — architected to scale to billions of users.

- **Backend:** Node + Express + MongoDB + Socket.IO (ES modules), module-based with SOLID
- **Frontend:** React + Vite + Tailwind (ES modules), premium WhatsApp-style UI
- Both sides share **one API contract** (see below).

---

## Quick start

You need **Node 18+** and a **local MongoDB** running on `mongodb://127.0.0.1:27017`.

```bash
# 1) Backend  →  http://localhost:4002
cd backend
npm install
npm run seed      # creates users, friendships and sample statuses
npm run dev       # or: npm start

# 2) Frontend →  http://localhost:5173   (in a second terminal)
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** and log in as **John Doe** for the richest demo
(unseen + viewed feed sections, a private status, and viewers on your own posts).

> The Vite dev server proxies `/api` and `/socket.io` to the backend, so the browser
> only ever talks to one origin — same-origin in dev, mirrors production.

---

## Scale model (why this design)

The feed query **never scans all users**. It only looks at the current user's
bounded friend set (`ownerId $in [friendIds]`) plus `expiresAt > now`, served by a
compound index `(ownerId, expiresAt)`. A billion-user platform is irrelevant to a
query that only touches your ~hundreds of friends.

- **Immutable statuses** — a view never mutates the Status doc (no hot document).
- **Insert-only `StatusView`** — "seen?" answered in ms via `(viewerId, statusId)` index.
- **No feed fan-out** — the feed is generated on read, not written to N inboxes.
- **TTL index** on `expiresAt` — Mongo auto-expires statuses at 24h, zero cron.

---

## API contract (shared by frontend & backend)

All status/friends routes require an `x-user-id` header (the MVP "login").

| Method | Path                          | Purpose                                        |
|--------|-------------------------------|------------------------------------------------|
| GET    | `/api/users`                  | List users (login screen)                      |
| GET    | `/api/friends`                | Current user's friends                         |
| POST   | `/api/status`                 | Create a text status                           |
| GET    | `/api/status/feed`            | Grouped, privacy-filtered, unseen-first feed   |
| GET    | `/api/status/me`              | My active statuses (+ viewer counts)           |
| GET    | `/api/status/:userId`         | One friend's statuses (+ `resumeIndex`)        |
| POST   | `/api/status/:statusId/view`  | Record a view (idempotent)                     |
| GET    | `/api/status/:statusId/viewers` | Viewers of my status (owner only → 403 else) |
| DELETE | `/api/status/:statusId`       | Delete my own status                           |

**Socket events** (server → client, scoped to the owner's friend rooms):
`status:created`, `status:viewed`, `status:deleted`.

---

## Design patterns

| Pattern            | Where                                                             |
|--------------------|------------------------------------------------------------------|
| Repository         | `*/**.repository.js` + `core/repositories/base.repository.js`    |
| Service layer      | `*/**.service.js`                                                |
| Strategy           | `modules/privacy/strategies/*` (Everyone / Except / Only-share)  |
| Factory            | `privacy.factory.js`, `socket.factory.js`, `state.factory.js`    |
| State              | `core/feed/states/*` (Unseen vs Seen ordering buckets)           |
| Observer / Pub-Sub | `core/socket/socket.publisher.js` + client `socket.subscriber.js`|
| Singleton          | `config/{database,socket,env}.js`, client `axios.js`, `socket.js`|
| Mapper             | `*.mapper.js` (DTO ⇄ view model)                                 |
| Provider / Reducer | `AuthProvider`, `StatusProvider` + `status.reducer.js`           |

Dependency direction is strictly one-way on both sides:
`routes → controller → service → repository → Mongo` (backend) and
`pages → components → hooks → services → axios/socket` (frontend).

---

## Screens (all 13 from the reference)

Login · Status feed · Create status · Privacy options · Contacts except ·
Only share with · Status sent · Story viewer · Multiple statuses · Seen/Unseen
ordering · Viewers list · Delete confirm · Empty state.

## Ports

- Backend API + Socket.IO: **4002** (configurable in `backend/.env`)
- Frontend (Vite): **5173**
