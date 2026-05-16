# Notification System Backend (MVP)

Event-driven notification engine with strategy/observer/factory patterns, an in-memory queue, retry worker with exponential backoff, and a versioned-template + payload-snapshot rendering pipeline.

## Stack
- Node.js (ESM)
- Express
- Mongoose (MongoDB)
- Native EventEmitter (observer/event bus)

## Quick start

```bash
cd Backend
npm install
npm run seed     # populate users / templates / sample notifications
npm run dev      # start on http://localhost:5001
```

Make sure MongoDB is running locally on `mongodb://localhost:27017` (override with `MONGODB_URI` in `.env`).

## Environment

`.env`:
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/notification_system
CLIENT_ORIGIN=http://localhost:5173
LOG_LEVEL=info
```

## Auth (MVP)
No JWT. Every request reads `x-actor-id` / `x-actor-role` headers (defaults to the seeded admin if missing).

## API
See `Notification/_contract/API_CONTRACT.md` for the canonical contract. Every response uses the envelope:

```json
{ "success": true, "data": ..., "error": null }
```

## Architecture highlights
- **Strategy** — `modules/notification/strategies/{email,sms,push}.strategy.js`
- **Factory** — `modules/notification/factories/notificationChannel.factory.js`
- **Observer** — `shared/queue/queueManager.js` wraps a singleton `EventEmitter`; listeners in `modules/notification/observers/`
- **State** — `modules/notification/state/*.state.js` mediate status transitions
- **Repository** — every service uses `repositories/` (no Mongoose calls escape repos)
- **Template engine** — `shared/utils/template.util.js → injectVariables(str, payload)`; templates are immutable & versioned; notifications store only `(templateId, templateVersion, payloadSnapshot)` and re-render on read
- **Workers** — `notification.worker.js` polls the queue, `retry.worker.js` reprocesses failed jobs with exponential backoff `5s * 2^(attempt-1)` up to 3 attempts before `DEAD`

## Scripts
- `npm run dev` — nodemon
- `npm start` — production
- `npm run seed` — fills DB with users + templates + sample notifications
