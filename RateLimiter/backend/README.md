# Rate Limiter Backend

MERN backend for a learning Rate Limiter project. Implements three pluggable rate-limiting strategies behind a Strategy/Factory/Singleton architecture.

## Stack

- Node.js (ESM, `"type": "module"`)
- Express 4
- Mongoose 8 (MongoDB)
- bcryptjs + jsonwebtoken
- In-memory state manager for hot-path counters

## Strategies

- `FIXED_WINDOW` — counts requests per fixed window of `windowSeconds`
- `SLIDING_WINDOW` — keeps timestamps over a moving window
- `TOKEN_BUCKET` — bucket of `capacity` tokens refilling at `refillRatePerSec`

Switch at runtime via `PUT /api/admin/strategy`.

## Setup

```bash
cp .env.example .env
npm install
npm run seed
npm run dev
```

Server listens on `PORT` (default 4000). Health check at `GET /health`.

## Default Credentials (after `npm run seed`)

| Role   | Username          | Password   |
| ------ | ----------------- | ---------- |
| admin  | `admin`           | `admin123` |
| client | `mobile-app`      | `client123`|
| client | `payment-service` | `client123`|
| client | `user-123`        | `client123`|

API keys are printed during seeding (use the `apiKey` field). They are also returned from `POST /api/auth/login` for the corresponding user.

## API Quick Reference

Base path: `/api`. All JSON. JWT via `Authorization: Bearer <token>`. API key via `x-api-key: <apiKey>`.

### Auth
- `POST /api/auth/login` `{ username, password }`
- `POST /api/auth/register` `{ username, password }` (creates a client)
- `GET /api/auth/me`

### Consumer
- `POST /api/v1/request` (headers `x-api-key`) body `{ endpoint? }`
- `GET /api/v1/usage` (Bearer)
- `GET /api/v1/strategy/current` (public)

### Admin (Bearer + role=admin)
- `GET /api/admin/dashboard`
- `GET /api/admin/strategies` / `PUT /api/admin/strategy` `{ strategyType }`
- `GET /api/admin/config` / `PUT /api/admin/config` (partial)
- `GET /api/admin/clients` / `GET /api/admin/clients/:clientId`
- `POST /api/admin/clients` `{ username, password }`
- `POST /api/admin/clients/:clientId/reset|block|unblock`

Error shape: `{ error: { message, code? } }`.

## Architecture

```
controllers -> services -> repositories
                 |
                 +-> singleton (StrategyRegistry)
                 +-> factory  (createStrategy)
                 +-> strategies/* (FixedWindow, SlidingWindow, TokenBucket)
                 +-> state    (RateLimiterStateManager + ClientState) <-- in-memory
                 +-> dto      (RequestContext, RateLimitResponse)
```

Hot-path state lives in memory (single Node process). Mongo persists Clients, Config, and a RequestLog stream used for stats/dashboard aggregations. A periodic cleanup service prunes idle clients and expired window timestamps every 30s.
