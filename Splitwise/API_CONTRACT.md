# Splitwise — API Contract (Backend ↔ Frontend)

Both backend and frontend MUST adhere to this contract exactly. Keep the wire shapes identical to what is documented here.

## Base
- Backend base URL: `http://localhost:5000/api`
- Frontend dev server: `http://localhost:5173`
- All requests/responses are JSON.
- CORS is open during dev.

## Auth model (MVP — no JWT)
There is **no real auth** in MVP. The frontend selects an "active user" on the Login screen (picks from existing users or creates one), then stores it in localStorage. The selected user's `userId` is sent in:
- request header `x-user-id: <userId>` on protected routes, OR
- as a body field `actingUserId` for actions like settle, addExpense, etc.

The backend just looks up the user; do not enforce passwords.

## Common response envelope

Success:
```json
{ "success": true, "data": { ... } }
```

Error:
```json
{ "success": false, "code": "ERROR_CODE", "message": "Readable message" }
```

HTTP statuses used: 200, 201, 400, 404, 409, 500.

## Domain types (shape)

```ts
User {
  userId: string,         // uuid
  name: string,
  email: string,
  createdAt: ISODateString
}

GroupMember {
  userId: string,
  name: string,
  role: "CREATOR" | "MEMBER",
  status: "ACTIVE" | "INACTIVE",
  joinedAt: ISODateString
}

Group {
  groupId: string,
  name: string,
  description: string,
  createdBy: string,            // userId
  members: GroupMember[],
  createdAt: ISODateString,
  updatedAt: ISODateString
}

SplitType = "EQUAL" | "EXACT" | "PERCENT"

ExpenseShare {
  userId: string,
  amount: number              // share amount in INR, rounded to 2 decimals
}

Expense {
  expenseId: string,
  groupId: string,
  description: string,
  amount: number,
  paidBy: string,             // userId
  splitType: SplitType,
  participants: string[],     // list of userIds participating
  shares: ExpenseShare[],     // derived from strategy server-side
  // splitInput is only on create/update payload (see below)
  createdAt: ISODateString,
  updatedAt: ISODateString
}

Settlement {
  settlementId: string,
  groupId: string,
  fromUserId: string,
  toUserId: string,
  amount: number,
  note?: string,
  createdAt: ISODateString
}

Balance {                     // net balance per user inside a group
  userId: string,
  name: string,
  netAmount: number           // positive => is owed, negative => owes
}

Debt {                        // edge in simplified debt graph
  fromUserId: string,
  fromName: string,
  toUserId: string,
  toName: string,
  amount: number
}
```

## Endpoints

### Users
- `POST   /api/users` — create user `{ name, email }` → `{ user }`
- `GET    /api/users` — list all users → `{ users: User[] }`
- `GET    /api/users/:userId` — `{ user }`

### Groups
- `POST   /api/groups` — body `{ name, description, createdBy }` → `{ group }`
  - Auto-adds `createdBy` as first member with role `CREATOR`.
- `GET    /api/groups` — query `?userId=` (optional). Returns groups the user belongs to (or all groups if no userId) → `{ groups: Group[] }`
- `GET    /api/groups/:groupId` → `{ group }`
- `PATCH  /api/groups/:groupId` — body `{ name?, description? }` → `{ group }`
- `POST   /api/groups/:groupId/members` — body `{ userId }` → `{ group }`
- `DELETE /api/groups/:groupId/members/:userId` — soft-remove (status=INACTIVE) → `{ group }`
- `POST   /api/groups/:groupId/leave` — body `{ userId }` → `{ group }` (same effect as remove)

### Expenses
- `POST   /api/groups/:groupId/expenses` — body:
  ```json
  {
    "description": "Dinner",
    "amount": 1000,
    "paidBy": "<userId>",
    "splitType": "EQUAL" | "EXACT" | "PERCENT",
    "participants": ["<uid1>", "<uid2>", ...],
    "splitInput": {
      // for EQUAL: omit or {}
      // for EXACT: { "amounts": { "<userId>": 250, "<userId>": 750 } }
      // for PERCENT: { "percents": { "<userId>": 40, "<userId>": 60 } }
    }
  }
  ```
  → `{ expense }`

  Backend validates: paidBy ∈ participants is NOT required (someone can pay without consuming). Sum of shares must equal `amount` (tolerance 0.01). Percentages must sum to 100.

- `GET    /api/groups/:groupId/expenses` → `{ expenses: Expense[] }`
- `GET    /api/expenses/:expenseId` → `{ expense }`
- `PATCH  /api/expenses/:expenseId` — same body shape as create (all fields optional except those needed to recompute splits). Returns `{ expense }`.
- `DELETE /api/expenses/:expenseId` → `{ success: true }`

### Settlements
- `POST   /api/groups/:groupId/settlements` — body `{ fromUserId, toUserId, amount, note? }` → `{ settlement }`
- `GET    /api/groups/:groupId/settlements` → `{ settlements: Settlement[] }`

### Balances
- `GET    /api/groups/:groupId/balances` → `{ balances: Balance[] }`
  - Computed: sum(shares user owes) − sum(user's paid amounts) − settlements applied.
  - Convention: `netAmount > 0` means others owe this user (positive); `< 0` means user owes.
- `GET    /api/groups/:groupId/balances/simplified` → `{ debts: Debt[] }`
  - Greedy debt simplification: pair largest creditor with largest debtor iteratively.

### Health
- `GET /api/health` → `{ status: "ok", service: "splitwise-backend" }`

## Error codes (suggested)
- `VALIDATION_ERROR` (400)
- `USER_NOT_FOUND` (404)
- `GROUP_NOT_FOUND` (404)
- `EXPENSE_NOT_FOUND` (404)
- `NOT_A_MEMBER` (409)
- `INVALID_SPLIT` (400) — when shares/percents don't sum correctly
- `INTERNAL_ERROR` (500)

## Notes
- All amounts are rounded server-side to 2 decimals using `Math.round(x * 100) / 100`. Distribute rounding remainder to the last share.
- Balances are **derived state**: recomputed on every `/balances` GET from expenses + settlements. No caching.
- IDs are uuid v4 (use `uuid` lib). Mongo `_id` is internal; the API exposes `userId`/`groupId`/`expenseId`/`settlementId`.
- Frontend axios client must read `success: false` and surface `message` as toast.
