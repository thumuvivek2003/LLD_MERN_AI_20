# Splitwise Backend (MVP)

Node.js + Express + MongoDB (mongoose), ESM. Implements the API documented in `../API_CONTRACT.md`.

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

The server listens on `http://localhost:5000`. All routes are mounted under `/api`.

## Health

```
GET /api/health
```

## Layout

```
src/
  server.js              boot
  app.js                 createApp()
  config/env.config.js   dotenv + defaults
  core/
    database/            mongo singleton
    errors/              AppError
    middlewares/         requestLogger, error handler
    utils/               asyncHandler, response, amount
  modules/
    user/ group/ expense/ settlement/ balance/
  routes/index.js        /health + module mounts
```

Split strategies live under `modules/expense/strategies/` and are produced by `SplitStrategyFactory`.
Balances are not stored — they are derived on every read from expenses + settlements.
