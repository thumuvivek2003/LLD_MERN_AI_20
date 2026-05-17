# Auction Frontend

React 18 + Vite frontend for the Auction LLD MVP. Follows the shared
`api_contract.md` and `folder_file_structure.md` in the parent folder.

## Stack

- React 18, Vite 5, react-router-dom 6
- Zustand (with `persist` for auth)
- axios (single `apiClient` with auth interceptor + global error toast)
- socket.io-client 4 (singleton `socketClient` for live updates)
- Tailwind 3 + react-hot-toast + lucide-react icons

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Backend is expected at `http://localhost:5001`. Vite proxies `/api` to it
in dev.

## Roles & routes

- `/login`, `/register` — public
- `/admin/*` — ADMIN only (sidebar layout)
- `/member/*` — MEMBER only
- `/spectator/*` — public read-only
- `/` redirects based on role

## Seeded users

- admin@auction.com / Admin@123
- alice@auction.com / Member@123
- bob@auction.com / Member@123
- eve@auction.com / Specta@123

## Patterns

- **Strategy** — `services/apiClient.js` is the only place axios is used.
- **Observer / Pub-Sub** — `services/socketClient.js` singleton wraps
  socket.io-client; `useLiveAuction` / `useSpectatorLiveFeed` subscribe.
- **Composition** — small shared primitives (`Button`, `Modal`, etc.)
  composed into module pages.
- **Centralized state** — Zustand stores expose actions; components never
  mutate state directly.
