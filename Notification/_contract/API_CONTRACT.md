# Notification System — API Contract (Shared)

Backend base URL: `http://localhost:5001`
Frontend dev URL: `http://localhost:5173`
All endpoints prefixed: `/api`
Auth: **NONE** (MVP — actor is selected via header `x-actor-id` + `x-actor-role`, or via active user switcher on frontend).

Response envelope (every endpoint):
```json
{ "success": true, "data": <payload>, "error": null }
```
On error:
```json
{ "success": false, "data": null, "error": { "code": "STRING", "message": "..." } }
```

---

## Enums (shared constants)

```js
// channelType
EMAIL | SMS | PUSH

// notificationStatus
QUEUED | SENDING | SENT | FAILED | RETRYING | DEAD

// eventType
ORDER_CREATED | PAYMENT_SUCCESS | RIDE_COMPLETED | RIDE_BOOKED | CUSTOM
```

---

## 1. Notification module

### POST /api/notifications/trigger
Fires a business event → creates notification jobs for each enabled channel of the user.
```json
// Request
{
  "userId": "u1",
  "eventType": "PAYMENT_SUCCESS",
  "payload": { "name": "Vivek", "amount": 500 },
  "channels": ["EMAIL", "SMS"]   // optional; if omitted use user preferences
}
// Response.data
{
  "eventId": "evt_xxx",
  "notifications": [
    { "id": "n1", "channel": "EMAIL", "status": "QUEUED" },
    { "id": "n2", "channel": "SMS",  "status": "QUEUED" }
  ]
}
```

### POST /api/notifications/send
Admin-triggered single notification (uses template or custom content).
```json
// Request
{
  "userId": "u1",
  "templateId": "t1",       // optional (else custom)
  "eventType": "CUSTOM",    // optional
  "channels": ["EMAIL"],
  "payload": { "name": "Vivek" },
  "custom": { "subject": "...", "body": "..." }   // optional override
}
```

### POST /api/notifications/send-group
Send the same template to multiple users.
```json
// Request
{
  "userIds": ["u1","u2","u3"],
  "templateId": "t1",
  "channels": ["EMAIL","SMS","PUSH"],
  "payload": { "promoCode": "WELCOME50" }
}
// Response.data
{ "groupId": "grp_xx", "count": 9 }
```

### GET /api/notifications
List notifications with filters. Query params:
`status`, `channel`, `eventType`, `userId`, `limit` (default 50), `cursor`.
```json
// Response.data
{
  "items": [ <NotificationDTO> ],
  "nextCursor": "..."
}
```

### GET /api/notifications/:id
Returns full `NotificationDTO` including rendered preview (re-rendered from templateId + payloadSnapshot), retry timeline.

### POST /api/notifications/:id/retry
Manual retry — only allowed if status is `FAILED` or `DEAD`.

### GET /api/notifications/user/:userId
User-facing inbox.

---

## 2. Template module

### GET /api/templates
List active templates.

### GET /api/templates/:id
Includes all versions.

### POST /api/templates
Create new template (creates v1 automatically).
```json
{
  "name": "Payment Success",
  "eventType": "PAYMENT_SUCCESS",
  "channel": "EMAIL",
  "subjectTemplate": "Payment Received",
  "bodyTemplate": "Hi {{name}}, your payment of ₹{{amount}} was successful."
}
```

### POST /api/templates/:id/versions
Creates a new immutable version. Old versions stay queryable; the latest becomes `isActive`.

### GET /api/templates/:id/versions
Returns version history.

---

## 3. User module

### GET /api/users
List all users (for admin / send-group audience selector).

### GET /api/users/:id
Single user with preferences.

### GET /api/users/:id/preferences
```json
// Response.data
{ "emailEnabled": true, "smsEnabled": true, "pushEnabled": false }
```

### PUT /api/users/:id/preferences
Body shape identical to above.

---

## 4. Admin / Dashboard module

### GET /api/admin/dashboard
```json
// Response.data
{
  "totals": { "sent": 1240, "failed": 32, "queued": 18, "retrying": 4 },
  "channelBreakdown": { "EMAIL": 800, "SMS": 300, "PUSH": 140 },
  "recentFailures": [ <NotificationDTO> ]
}
```

### GET /api/admin/stats
Aggregations for analytics page (counts by status/channel/eventType over time).

---

## 5. System module (queue/retry/logs)

### GET /api/system/queue
Snapshot of in-memory queue.
```json
{ "size": 12, "workers": 2, "jobs": [{ "id":"...", "notificationId":"...", "attempt":1, "scheduledAt":"..." }] }
```

### GET /api/system/retry-queue
Pending retry jobs (with backoff schedule).

### GET /api/system/logs
Recent delivery log entries (success/failure + timestamps).

---

## DTOs (shared shape between BE and FE)

```ts
NotificationDTO {
  id: string
  userId: string
  user?: { id, name, email, phone }
  templateId: string | null
  templateVersion: number | null
  channel: 'EMAIL' | 'SMS' | 'PUSH'
  eventType: string
  status: 'QUEUED' | 'SENDING' | 'SENT' | 'FAILED' | 'RETRYING' | 'DEAD'
  payloadSnapshot: Record<string, any>
  renderedPreview: { subject: string, body: string }   // re-rendered at read time
  retryCount: number
  attempts: Array<{ at: string, status: string, error?: string }>
  createdAt: string
  updatedAt: string
}

TemplateDTO {
  id: string
  name: string
  eventType: string
  channel: 'EMAIL' | 'SMS' | 'PUSH'
  activeVersion: number
  versions: Array<{
    version: number
    subjectTemplate: string
    bodyTemplate: string
    createdAt: string
    isActive: boolean
  }>
}

UserDTO {
  id: string
  name: string
  email: string
  phone: string
  pushToken?: string
  preferences: { emailEnabled, smsEnabled, pushEnabled }
}
```

---

## Frontend service layer mapping

Each FE module wraps these endpoints (axiosClient):
- `userNotification.service.js`  → `/api/notifications/user/:userId`, `/api/users/:id/preferences`
- `adminNotification.service.js` → `/api/notifications`, `/api/notifications/:id`, `/api/admin/*`, `/api/notifications/:id/retry`
- `template.service.js`          → `/api/templates*`
- `notification.service.js`      → `/api/notifications/send`, `/api/notifications/send-group`
- `system.service.js`            → `/api/system/*`
