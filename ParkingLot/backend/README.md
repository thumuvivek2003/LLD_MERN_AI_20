# Parking Lot Backend

Minimal Node.js (ESM) backend for an LLD Parking Lot.

## Run
```
npm install
npm start
```

## Roles
- ADMIN — manages lots, floors, slots, users, pricing
- ENTRY_WATCHMAN — vehicle entry, slot allocation, ticket
- EXIT_WATCHMAN — search ticket, calculate price, payment, free slot

## Auth
`POST /auth/login` -> returns base64 token. Pass via `Authorization: Bearer <token>`.

Seeded admin: `admin / admin`.
