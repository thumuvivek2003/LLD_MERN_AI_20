# ATM Backend (MERN, ESM)

Minimal LLD-flavored ATM machine backend. Express + Mongoose + ESM modules.

## Patterns used (kept simple, not over-engineered)
- **State** — `src/modules/atm/states/*` driven by `entities/ATM.js`
- **Strategy** — `src/modules/bank/strategies/*BankService.js`
- **Factory** — `src/modules/bank/factory/bankService.factory.js`, `src/modules/hardware/factory/hardware.factory.js`
- **Chain of Responsibility** — `src/modules/cash/chain/*Handler.js`
- **Repository** — `src/modules/*/repositories/*`
- **Singleton** — `src/core/database/mongo.singleton.js`

## Setup

```bash
cd ATM/Backend
npm install
# make sure mongod is running locally (default mongodb://127.0.0.1:27017)
npm run seed
npm run dev
```

Server starts on `http://localhost:5001`.

## Demo cards

| Card number        | PIN  | Bank  | Balance   |
|--------------------|------|-------|-----------|
| 4111111111111111   | 1234 | SBI   | ₹50,000   |
| 5222222222222222   | 5678 | HDFC  | ₹25,000   |
| 6333333333333333   | 9999 | ICICI | ₹1,00,000 |

ATM is seeded with 50 notes each of ₹2000 / ₹500 / ₹200 / ₹100.

## API (all JSON, prefix `/api/atm`)

| Method | Path                    | Body                              | Notes |
|--------|-------------------------|-----------------------------------|-------|
| GET    | `/cards`                | —                                 | Demo card list (no real reader)   |
| POST   | `/insert-card`          | `{ cardNumber }`                  | Returns `{ sessionId, bankName, bankCode, state }` |
| POST   | `/enter-pin`            | `{ sessionId, pin }`              | Returns `{ success, attemptsLeft, state }`. 3 wrong → card blocked (HTTP 403) |
| POST   | `/balance`              | `{ sessionId }`                   | Returns `{ balance }` |
| POST   | `/withdraw/preview`     | `{ sessionId, amount }`           | Returns `{ breakdown, total }`, no debit yet |
| POST   | `/withdraw/confirm`     | `{ sessionId, amount }`           | Debits, dispenses, records txn |
| POST   | `/collect-cash`         | `{ sessionId }`                   | Marks txn collected, returns to AUTHENTICATED |
| POST   | `/eject-card`           | `{ sessionId }`                   | Ends session, returns IDLE |
| GET    | `/session/:sessionId`   | —                                 | Polling/recovery |

Session expires after `SESSION_TIMEOUT_MS` (60s default) of inactivity; any operation will return HTTP 409 `SESSION_EXPIRED` and reset the session.

## Env

`.env`:

```
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/atm_mvp
SESSION_TIMEOUT_MS=60000
MAX_PIN_ATTEMPTS=3
CORS_ORIGIN=http://localhost:5173
```
