# API Contract — Ecommerce Cart & Checkout MVP

This is the **single source of truth** the backend and frontend must agree on.
Both teams MUST follow this verbatim — paths, methods, request/response shapes, error envelope, auth headers.

---

## Conventions

- Base URL (frontend): `import.meta.env.VITE_API_URL` (default `http://localhost:5001/api`)
- Base URL (backend): app mounts everything under `/api`
- Auth: `Authorization: Bearer <token>` header for protected routes
- Token payload: `{ _id, role }` (`role` ∈ `"customer" | "admin"`)
- All ids are MongoDB ObjectId strings (`_id`)
- All money values are numbers (rupees, integer or float OK — frontend just renders)

### Success envelope

```json
{ "success": true, "data": { ... } }
```

### Error envelope

```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "..." } }
```

HTTP status codes: 200 OK, 201 Created, 400 Validation, 401 Unauthorized, 403 Forbidden, 404 NotFound, 409 Conflict, 500 Internal.

---

## Domain types (returned shapes)

### User
```json
{ "_id": "...", "name": "...", "email": "...", "role": "customer|admin", "blocked": false }
```

### Product
```json
{
  "_id": "...",
  "name": "Wireless Headphones",
  "description": "...",
  "price": 199,
  "image": "https://...",
  "category": "audio",
  "stock": 25
}
```

### CartItem (embedded in Cart)
```json
{ "productId": "...", "name": "...", "image": "...", "price": 199, "quantity": 2, "subtotal": 398 }
```

### PriceSummary (embedded in Cart and Order)
```json
{ "subtotal": 398, "discount": 50, "deliveryFee": 40, "platformFee": 10, "total": 398 }
```

### Cart
```json
{
  "_id": "...",
  "userId": "...",
  "items": [ /* CartItem[] */ ],
  "appliedCoupon": { "code": "SAVE10", "type": "percentage", "value": 10 } ,
  "pricing": { /* PriceSummary */ }
}
```
`appliedCoupon` may be `null`.

### Coupon
```json
{
  "_id": "...",
  "code": "SAVE10",
  "type": "percentage|flat|free_shipping",
  "value": 10,
  "minCartValue": 0,
  "description": "10% off on orders above ₹500",
  "active": true,
  "assignedUserIds": ["..."]
}
```

### Order
```json
{
  "_id": "...",
  "userId": "...",
  "items": [ /* CartItem[] */ ],
  "pricing": { /* PriceSummary */ },
  "payment": { "type": "upi|card|wallet|cod", "status": "success|failed|pending", "transactionId": "TXN_..." },
  "status": "CREATED|PAID|SHIPPED|DELIVERED|CANCELLED",
  "address": { "line1": "...", "city": "...", "pincode": "..." },
  "createdAt": "2026-01-01T..."
}
```

---

## Endpoints

### Auth — `/api/auth`

| Method | Path | Auth | Body | Returns |
| ------ | ---- | ---- | ---- | ------- |
| POST | `/register` | – | `{ name, email, password, role? }` | `{ token, user }` |
| POST | `/login`    | – | `{ email, password }`              | `{ token, user }` |

> `role` defaults to `customer`. Admin can be seeded.

---

### Products — `/api/products`

| Method | Path | Auth | Returns |
| ------ | ---- | ---- | ------- |
| GET | `/`     | – | `{ products: Product[] }` |
| GET | `/:id`  | – | `{ product: Product }` |

---

### Cart — `/api/cart` (customer)

All routes require `customer` token. Cart is auto-created on first access.

| Method | Path | Body | Returns |
| ------ | ---- | ---- | ------- |
| GET    | `/`                    | – | `{ cart }` |
| POST   | `/items`               | `{ productId, quantity }` | `{ cart }` |
| PATCH  | `/items/:productId`    | `{ quantity }` | `{ cart }` |
| DELETE | `/items/:productId`    | – | `{ cart }` |
| POST   | `/coupon`              | `{ code }` | `{ cart }` |
| DELETE | `/coupon`              | – | `{ cart }` |
| DELETE | `/`                    | – | `{ cart }` (clears items) |

---

### Coupons — `/api/coupons` (customer)

| Method | Path | Returns |
| ------ | ---- | ------- |
| GET | `/`     | `{ coupons: Coupon[] }` (only active + assigned-to-user OR global) |

---

### Checkout — `/api/checkout` (customer)

| Method | Path | Body | Returns |
| ------ | ---- | ---- | ------- |
| POST | `/` | `{ paymentType: "upi"|"card"|"wallet"|"cod", address: { line1, city, pincode }, paymentDetails?: object }` | `{ order, payment }` |

Server orchestrates: validate cart → validate inventory → recalc pricing → process payment (Strategy) → build order (Builder) → set state CREATED → on payment success move to PAID → clear cart.

On payment failure return 402-style payload but use 400 with `{ code: "PAYMENT_FAILED" }`.

---

### Orders — `/api/orders` (customer)

| Method | Path | Returns |
| ------ | ---- | ------- |
| GET | `/`     | `{ orders: Order[] }` (only this user) |
| GET | `/:id`  | `{ order: Order }` |

---

### Admin — `/api/admin` (admin only)

| Method | Path | Body | Returns |
| ------ | ---- | ---- | ------- |
| GET    | `/stats`                            | – | `{ stats: AdminStats }` |
| GET    | `/users`                            | – | `{ users: User[] }` |
| GET    | `/users/:id`                        | – | `{ user: User, orders: Order[], assignedCoupons: Coupon[] }` |
| PATCH  | `/users/:id/block`                  | – | `{ user }` |
| PATCH  | `/users/:id/unblock`                | – | `{ user }` |
| GET    | `/coupons`                          | – | `{ coupons: Coupon[] }` |
| GET    | `/coupons/:id`                      | – | `{ coupon: Coupon, assignedUsers: User[] }` |
| POST   | `/coupons`                          | `{ code, type, value, minCartValue?, description?, active? }` | `{ coupon }` |
| PUT    | `/coupons/:id`                      | `{ type?, value?, minCartValue?, description?, active? }` (code immutable) | `{ coupon }` |
| DELETE | `/coupons/:id`                      | – | `{ deleted: true }` |
| PATCH  | `/coupons/:id/toggle`               | – | `{ coupon }` |
| POST   | `/coupons/:id/assign`               | `{ userId }` | `{ coupon }` |
| DELETE | `/coupons/:id/assign/:userId`       | – | `{ coupon }` |
| GET    | `/orders`                           | – | `{ orders: Order[] }` (all users) |
| GET    | `/orders/:id`                       | – | `{ order: Order, customer: User }` |
| PATCH  | `/orders/:id/status`                | `{ status }` | `{ order }` |

Allowed admin status transitions: `PAID → SHIPPED → DELIVERED`, and `CREATED|PAID → CANCELLED`.

### AdminStats shape
```json
{
  "totalOrders": 0,
  "totalRevenue": 0,
  "totalUsers": 0,
  "blockedUsers": 0,
  "totalCoupons": 0,
  "activeCoupons": 0,
  "ordersByStatus": { "CREATED": 0, "PAID": 0, "SHIPPED": 0, "DELIVERED": 0, "CANCELLED": 0 },
  "recentOrders": [ /* Order[] up to 5, newest first */ ]
}
```
Revenue excludes CANCELLED orders.

---

## Frontend → Backend examples

```js
// Login
POST /api/auth/login   { email, password }
// 200 { success: true, data: { token, user } }

// Add to cart
POST /api/cart/items   Authorization: Bearer <t>   { productId, quantity: 1 }
// 200 { success: true, data: { cart } }

// Apply coupon
POST /api/cart/coupon  { code: "SAVE10" }
// 200 { success: true, data: { cart } } with pricing.discount populated

// Checkout
POST /api/checkout     { paymentType: "upi", address: {...}, paymentDetails: { vpa: "x@y" } }
// 200 { success: true, data: { order, payment } }
```

---

## Seed data (shared)

Backend seed script must create:
- Admin: `admin@shop.com` / `admin123` (role: `admin`)
- Customer: `user@shop.com` / `user123` (role: `customer`)
- ~6 products (audio, fashion, etc.) with images (use placeholder URLs)
- Coupons: `SAVE10` (10%), `FLAT100` (flat 100), `FREESHIP` (free_shipping)
