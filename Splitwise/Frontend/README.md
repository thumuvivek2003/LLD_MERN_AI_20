# Splitwise Frontend

React (Vite) + Tailwind + react-router app for the Splitwise LLD project.

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Dev server runs on `http://localhost:5173`.

Backend is expected at `http://localhost:5000/api` (override with `VITE_API_URL`).

## Routes

- `/` — Login / pick user
- `/dashboard` — Groups list + balance summary
- `/groups/new` — Create group
- `/groups/:groupId` — Group details (Expenses / Balances / Settlements / Members tabs)
- `/groups/:groupId/expenses/new` — Add expense
- `/groups/:groupId/expenses/:expenseId/edit` — Edit expense
- `/groups/:groupId/settle` — Settle up
