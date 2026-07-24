# Gmail MVP — Shared API Contract

This is the single source of truth for BOTH `backend/` and `frontend/`.
Frontend and backend MUST align exactly on these shapes. Do not deviate.

## Stack
- Backend: Node.js (ESM, `"type": "module"`) + Express + MongoDB (Mongoose) + Socket.IO
- Frontend: React + Vite + Tailwind CSS (ESM)
- Backend port: **4000** → base URL `http://localhost:4000`
- Frontend dev port: **5173** (Vite)
- REST base path: `http://localhost:4000/api`
- Socket.IO endpoint: `http://localhost:4000` (same server)
- CORS: backend allows origin `http://localhost:5173`

## Standard Response Envelope
Every REST response uses:
```json
{ "success": true,  "data": <payload> }
{ "success": false, "error": { "message": "...", "code": "..." } }
```

## DTO Shapes

### UserDTO
```json
{ "id": "string", "name": "string", "email": "string", "avatarColor": "#hex" }
```

### MailDTO
```json
{
  "id": "string",
  "threadId": "string",
  "sender": { "id": "string", "name": "string", "email": "string", "avatarColor": "#hex" },
  "receivers": [ { "id": "string", "name": "string", "email": "string", "avatarColor": "#hex" } ],
  "subject": "string",
  "body": "string",
  "timestamp": "ISO-8601 string",
  "status": "SENT | READ | UNREAD",
  "isRead": true,
  "snippet": "string (first ~90 chars of body)"
}
```

### ThreadDTO
```json
{
  "id": "string",
  "subject": "string",
  "participants": [ UserDTO ],
  "mails": [ MailDTO ]  // chronological, oldest first
}
```

## REST Endpoints

### Users
| Method | Path | Query/Body | Returns |
|---|---|---|---|
| GET | `/api/users` | — | `data: UserDTO[]` |
| GET | `/api/users/:id` | — | `data: UserDTO` |

### Mail
| Method | Path | Query/Body | Returns |
|---|---|---|---|
| POST | `/api/mails/send` | body `{ senderId, to: string[] (userIds), subject, body }` | `data: MailDTO` |
| GET | `/api/mails/inbox` | `?userId=` | `data: MailDTO[]` (newest first) |
| GET | `/api/mails/sent` | `?userId=` | `data: MailDTO[]` (newest first) |
| GET | `/api/mails/:id` | `?userId=` | `data: MailDTO` (marks READ for this user) |
| POST | `/api/mails/:id/reply` | body `{ senderId, body }` | `data: MailDTO` (reply, same threadId) |

Notes:
- `send`: persists mail, updates receiver inbox + sender sent, updates search index, creates/updates thread, emits socket event — all via the MailSent event (Observer/pub-sub).
- `reply`: reuses the parent mail's `threadId` and `subject` (prefixed `Re: ` if not already). Recipients = original sender + other receivers minus the replier.

### Thread
| Method | Path | Returns |
|---|---|---|
| GET | `/api/threads/:id` | `data: ThreadDTO` |

### Search
| Method | Path | Query | Returns |
|---|---|---|---|
| GET | `/api/search` | `?userId=&q=<term>&type=all\|from\|to\|subject\|body` | `data: MailDTO[]` (newest first) |

- Uses in-memory **inverted index** (Map<word, Set<mailId>>) built via Strategy pattern.
- Scope results to mails the `userId` participates in (as sender or receiver).
- `type` defaults to `all`.

## Socket.IO Contract

Client → Server:
- `user:join` payload `{ userId }` — join a room named by userId.

Server → Client (emitted to receiver's room):
- `mail:received` payload `MailDTO` — a new mail/reply landed in this user's inbox.

Constants (shared naming):
```
SOCKET_EVENTS = { USER_JOIN: 'user:join', MAIL_RECEIVED: 'mail:received' }
```

## Seed Users (must match screens.png)
Seeded on backend startup if the users collection is empty:
| name | email | avatarColor |
|---|---|---|
| Alice Johnson | alice@example.com | #6366f1 |
| Bob Smith | bob@example.com | #10b981 |
| Charlie Brown | charlie@example.com | #f59e0b |
| David Miller | david@example.com | #ef4444 |
| Emma Williams | emma@example.com | #8b5cf6 |

Also seed a few sample mails/threads between them so the inbox isn't empty on first load.

## Frontend `.env`
```
VITE_API_BASE_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
```

## Backend `.env`
```
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/gmail_mvp
CLIENT_ORIGIN=http://localhost:5173
```
