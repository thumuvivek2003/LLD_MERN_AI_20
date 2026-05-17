# Chat MVP — Frontend

WhatsApp-style real-time chat client built with **React 18 + Vite + Tailwind +
Socket.IO + zustand + React Router v6 + React Query**, following the SOLID /
pattern-driven structure described in `../folder_file_structure.md` and the
shared `../API_CONTRACT.md`.

## Quick start

```bash
npm install
npm run dev
```

The dev server listens on **http://localhost:5173** and talks to the backend at
**http://localhost:5000** (configurable via `.env`).

> Make sure the backend is running too — without it you'll still see the login
> page, but login itself requires `POST /api/auth/login`.

### Build / preview

```bash
npm run build
npm run preview
```

## Env vars

Set these in `.env` (defaults provided):

```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Dev credentials

For the MVP, OTPs are simulated:

| User           | Mobile        | OTP      |
|----------------|---------------|----------|
| Regular user   | any 10-digit  | `123456` |
| Admin          | `9999999999`  | `123456` |

The login response also includes the dev OTP — it's shown on the verify page
so you can copy/paste while developing.

## Architecture summary

```
src/
  api/                 axios instance + response-envelope unwrapper
  providers/           AppProvider (Router + SocketProvider) + QueryProvider
  routes/              AppRoutes + ProtectedRoutes + RoleRoutes guards
  layouts/             User & Admin shells (sidebars, headers, <Outlet/>)
  modules/
    auth/              login + OTP flow, JWT zustand store (persisted)
    user/              profile, contacts, presence cache
    chat/              chat list, threads, messages, groups
      strategies/      direct vs group rendering (Strategy pattern)
      store/           chat / message / typing zustand stores
    socket/            Singleton socket client, Context provider, listeners,
                       emitter helpers — Observer wiring lives in
                       socket.listeners.js
    admin/             dashboard, users, groups (role-gated)
  shared/              Buttons/Input/Modal/Avatar/Loader + utils + hooks
```

### Patterns applied

- **Singleton** — `socket.client.js` keeps one `socket.io-client` instance
  process-wide, wrapped in a React `SocketProvider`.
- **Observer / Pub-Sub** — `registerSocketListeners` subscribes every store to
  the relevant server events; emitters fan-out user actions.
- **Strategy** — `direct-chat.strategy.js` vs `group-chat.strategy.js` resolve
  header/title/avatar logic per chat type; `resolveChatStrategy(chat)` is the
  factory.
- **Repository-style services** — `*.service.js` files are thin axios wrappers
  returning `data.data` only, keeping pages/hooks free of transport concerns
  (SRP, dependency-inversion).
- **State management** — Per-feature `zustand` stores (`auth`, `chat`,
  `message`, `typing`, `user`, `admin`) — page-local UI state stays in
  `useState`.
- **Optimistic UI** — `MessageInput` → store append with `tempId` →
  `message:ack` reconciles the temp into the real message.

### Message lifecycle on the client

```
SENT       (optimistic local append, single gray check)
DELIVERED  (server pushes message:delivered, two gray checks)
READ       (server pushes message:read or chat:read-all, two blue checks)
```

The aggregated `status` on a `Message` is recomputed on the server; the
client only escalates (never downgrades) via `patchMessageStatus`.

### Real-time wiring

`SocketProvider` mounts whenever a JWT is in the auth store. On connect the
backend pushes `presence:snapshot`; subsequent `presence:online/offline`,
`message:*`, `typing:*`, and `chat:*` events all land in zustand via
`socket.listeners.js`. UI components subscribe to the stores and re-render
automatically.

## Folder match

Every file/function listed in `folder_file_structure.md` (frontend section)
exists. A couple of conveniences were added on top:

- `src/modules/chat/pages/ChatDetailPage.jsx` — routes `/chats/:chatId` and
  delegates to `ChatThread` (which is the shared body used by both
  `DirectChatPage` and `GroupChatPage` — the latter two still exist as
  thin wrappers so the structure stays intact).
- `src/modules/chat/components/ChatThread.jsx` — shared chat body to avoid
  duplicating ~150 LOC across the direct/group pages.
- `src/modules/chat/strategies/index.js` — small factory that picks the right
  strategy based on `chat.type`.

These are additive — no listed file/function was renamed or removed.
