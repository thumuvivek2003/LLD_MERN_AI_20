# Mailbox — Gmail MVP (Frontend)

A modern, premium email client UI built with **React 18 + Vite + Tailwind CSS**.
It talks to the Gmail MVP backend over REST and Socket.IO, following the shared
[`API_CONTRACT.md`](../API_CONTRACT.md) exactly.

## Features

- **Switch User** — pick a seeded user to sign in (persisted to `localStorage`).
- **Inbox / Sent** — read vs unread styling (bold sender + subject, unread dot).
- **Compose** — multi-select recipient chips, subject, body.
- **Open Email** — marks the mail read, with Reply / Reply-all / Forward.
- **Thread View** — full conversation timeline, oldest → newest.
- **Search** — debounced, with `All / From / To / Subject` filter chips.
- **Real-time notification** — toast pops up (top-right) when a `mail:received`
  socket event arrives; the inbox prepends new mail live.
- Loaders, skeletons, empty states, responsive layout — resilient when the
  backend is not yet running.

## Tech & patterns

- **axios** client that unwraps the `{ success, data }` envelope.
- **socket.io-client** singleton (`getSocket`) + `SocketProvider`.
- **Factory** (`MailViewModelFactory`): DTO → UI view model (times, initials, snippet).
- **State** pattern (`ReadState` / `UnreadState`): drives card presentation.
- **Strategy** pattern (`SearchContext` + strategies): search by field.
- **Service** layer wraps the API and applies view-model transforms.
- **Context**: `UserContext`, `ToastContext`, `SocketProvider`.

## Prerequisites

- Node.js 18+ and npm.
- The backend running at `http://localhost:4000` (see `../backend`). The UI
  degrades gracefully (loaders / empty states) if it is not.

## Environment

Configured in `.env`:

```
VITE_API_BASE_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

## Run

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build / preview

```bash
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Project structure

```
src/
├── main.jsx / App.jsx / index.css
├── routes/AppRoutes.jsx          # routing + user guard
├── layouts/MailLayout.jsx        # sidebar + header + outlet + toast host
├── shared/
│   ├── api/                      # axios client + endpoint modules
│   ├── socket/                   # socket singleton + provider
│   ├── context/                  # user + toast providers
│   ├── hooks/                    # useSocket, useDebounce, useAsync
│   ├── services/                 # Mail/Search/User/Thread services
│   ├── strategy/                 # search strategies + context
│   ├── factory/                  # MailViewModelFactory
│   ├── state/                    # Read/Unread state
│   ├── utils/formatter.js
│   └── components/               # Button, Input, Avatar, Toast, …
└── modules/
    ├── user/   (Switch User)
    ├── mail/   (Inbox, Sent, Compose, Mail details)
    ├── thread/ (Conversation timeline)
    └── search/ (Search + filters)
```
