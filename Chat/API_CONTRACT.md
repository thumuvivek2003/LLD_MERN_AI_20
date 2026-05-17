# Chat MVP — Shared API Contract

This contract is the **single source of truth** for both backend and frontend. Both must conform exactly.

## Conventions

- All REST routes are prefixed with `/api`.
- Backend port: **5000**. Frontend dev port: **5173**.
- Socket.IO endpoint: `http://localhost:5000` (same origin as REST).
- Auth: JWT in `Authorization: Bearer <token>` header for REST; for Socket.IO send via `auth: { token }` during handshake.
- Response envelope (success): `{ "success": true, "data": <payload> }`
- Response envelope (error): `{ "success": false, "error": { "code": "<STRING_CODE>", "message": "<human readable>" } }`
- All timestamps are ISO 8601 strings.
- All ids are MongoDB ObjectId strings.

## Roles

- `USER` — default role
- `ADMIN` — admin panel access

## OTP (MVP shortcut)

For MVP, OTP login is simulated. The fixed OTP is **`123456`** OR the backend returns the generated OTP in the login response (`data.otp`). Frontend should display it for dev convenience.

Admin login: mobile `9999999999`, OTP `123456` should auto-seed/assign ADMIN role on first login.

---

## REST Endpoints

### Auth

#### `POST /api/auth/login`
Request: `{ "mobile": "9876543210" }`
Response: `{ success, data: { "mobile": "9876543210", "otp": "123456" } }`

#### `POST /api/auth/verify-otp`
Request: `{ "mobile": "9876543210", "otp": "123456", "name": "Optional for new users" }`
Response:
```
{ success, data: {
    "token": "<jwt>",
    "user": { "id", "name", "mobile", "role", "isOnline", "lastSeen" }
} }
```

#### `POST /api/auth/logout`
Auth required. Response: `{ success, data: { "loggedOut": true } }`

---

### Users

#### `GET /api/users/me`
Auth required.
Response: `{ success, data: { "id", "name", "mobile", "role", "isOnline", "lastSeen" } }`

#### `PATCH /api/users/me`
Auth. Request: `{ "name": "New name" }`
Response: full user object.

#### `GET /api/users`
Auth. Returns all users except self (and excluding blocked). Used for the contacts list / new chat picker.
Response: `{ success, data: [{ "id", "name", "mobile", "isOnline", "lastSeen" }] }`

#### `GET /api/users/:id`
Auth. Response: full user object.

---

### Chats

#### `GET /api/chats`
Auth. Returns current user's chats, sorted by `updatedAt` desc.
Response: `{ success, data: [Chat] }`

`Chat` shape:
```
{
  "id": "<chatId>",
  "type": "DIRECT" | "GROUP",
  "name": "Display name (for DIRECT, the other user's name)",
  "avatar": null,
  "createdBy": "<userId>",
  "members": [
    { "userId", "name", "mobile", "role": "MEMBER"|"ADMIN", "isOnline", "lastSeen" }
  ],
  "lastMessage": { "id", "content", "senderId", "createdAt", "status" } | null,
  "unreadCount": 0,
  "updatedAt": "ISO"
}
```

#### `POST /api/chats/direct`
Auth. Request: `{ "userId": "<otherUserId>" }`
Returns existing direct chat if one exists, else creates.
Response: `{ success, data: Chat }`

#### `POST /api/chats/group`
Auth. Request: `{ "name": "Team", "memberIds": ["<id>","<id>"] }`
Creator becomes group ADMIN, included automatically.
Response: `{ success, data: Chat }`

#### `GET /api/chats/:chatId`
Auth. Response: single `Chat`.

---

### Messages

#### `GET /api/messages/:chatId?limit=50&before=<messageId>`
Auth. Paginated, newest last. `before` is optional cursor (message id).
Response: `{ success, data: [Message] }`

`Message` shape:
```
{
  "id",
  "chatId",
  "senderId",
  "senderName",
  "content",
  "createdAt",
  "status": "SENT" | "DELIVERED" | "READ",       // aggregated for current viewer
  "statuses": [                                    // per-recipient (used in MessageStatusPage / groups)
    { "userId", "name", "status", "timestamp" }
  ]
}
```

#### `POST /api/messages`
Auth. Request: `{ "chatId", "content", "tempId": "<client-uuid>" }`
Response: `{ success, data: Message }` (also includes `tempId` echoed)
Server also emits socket events to recipients.

#### `PATCH /api/messages/:messageId/read`
Auth. Marks the message read by current user.
Response: `{ success, data: { "messageId", "status": "READ" } }`

#### `PATCH /api/messages/:chatId/read-all`
Auth. Marks all messages in a chat as read by current user.
Response: `{ success, data: { "chatId", "readCount": <n> } }`

---

### Groups

#### `POST /api/groups/:chatId/members`
Auth (must be group ADMIN). Request: `{ "memberIds": ["<id>","<id>"] }`
Response: updated `Chat`.

#### `DELETE /api/groups/:chatId/members/:userId`
Auth (must be group ADMIN). Response: updated `Chat`.

#### `PATCH /api/groups/:chatId`
Auth (must be group ADMIN). Request: `{ "name": "New name" }`
Response: updated `Chat`.

---

### Admin

All admin routes require ADMIN role.

#### `GET /api/admin/stats`
Response: `{ success, data: { "totalUsers", "onlineUsers", "totalChats", "totalGroups", "messagesToday" } }`

#### `GET /api/admin/users`
Response: `{ success, data: [{ "id", "name", "mobile", "role", "isOnline", "lastSeen", "isBlocked", "createdAt" }] }`

#### `GET /api/admin/users/:id`
Detailed user view.

#### `PATCH /api/admin/users/:id/block`
Response: updated user.

#### `PATCH /api/admin/users/:id/unblock`
Response: updated user.

#### `GET /api/admin/groups`
Response: list of all group chats with member counts.

---

## Socket.IO Events

### Handshake
Client must connect with `auth: { token: "<jwt>" }`. Server rejects connection if invalid.
On connect: server marks user online and broadcasts `presence:online`. Server emits `presence:snapshot` with currently online user ids to the connecting client.

### Client → Server

| Event | Payload | Notes |
|---|---|---|
| `message:send` | `{ chatId, content, tempId }` | Server persists, returns `message:ack` to sender and `message:new` to recipients. |
| `message:read` | `{ messageId }` | Marks single message as read. |
| `chat:read-all` | `{ chatId }` | Mark all messages in chat as read. |
| `typing:start` | `{ chatId }` | |
| `typing:stop` | `{ chatId }` | |
| `chat:join` | `{ chatId }` | Joins socket.io room for the chat. |
| `chat:leave` | `{ chatId }` | |

### Server → Client

| Event | Payload | Notes |
|---|---|---|
| `message:new` | `Message` | New message in a chat the user is a member of. |
| `message:ack` | `{ tempId, message: Message }` | Confirmation to sender. |
| `message:delivered` | `{ messageId, chatId, userId, timestamp }` | A recipient came online / received. |
| `message:read` | `{ messageId, chatId, userId, timestamp }` | A recipient read. |
| `chat:read-all` | `{ chatId, userId, timestamp }` | Bulk read. |
| `typing:start` | `{ chatId, userId, userName }` | |
| `typing:stop` | `{ chatId, userId }` | |
| `presence:online` | `{ userId }` | |
| `presence:offline` | `{ userId, lastSeen }` | |
| `presence:snapshot` | `{ onlineUserIds: [] }` | Emitted to connecting client. |
| `chat:new` | `Chat` | New chat involving the user (created by someone else). |
| `chat:updated` | `Chat` | Group renamed, members changed. |
| `error` | `{ code, message }` | |

---

## Message Status Lifecycle

```
SENT (created on server)
  → DELIVERED (per-recipient when recipient socket is online & in receive set)
  → READ (per-recipient when they open the chat / explicit read)
```

Aggregated status displayed to sender:
- DIRECT: status of the single recipient.
- GROUP: lowest status across all recipients (SENT < DELIVERED < READ).

---

## Standard Error Codes

- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `VALIDATION_ERROR` (400)
- `CONFLICT` (409)
- `INTERNAL_ERROR` (500)

---

## CORS

Backend must allow origin `http://localhost:5173` with credentials.
