# Food Delivery System (MERN · LLD MVP)

A learning-focused Food Delivery MVP built end-to-end with the MERN stack, applying SOLID and design patterns *only where they earn their keep*.

```
FoodDeliverySystem/
├── Backend/      Node + Express + MongoDB (ESM)
├── Frontend/     React + Vite + Tailwind (ESM)
├── Structure.md  Detailed file/function tree
├── Screens.md    Screen specs per actor
└── Chats.md      Requirements discussion
```

---

## Actors & flow

| Actor | Capabilities |
|---|---|
| Customer | Browse restaurants → view menu → cart → checkout → pay → track → OTP |
| Restaurant Admin | Manage menu items, accept/prepare orders, assign delivery partner via strategy |
| Delivery Partner | Accept tasks, mark out-for-delivery, verify OTP, complete delivery |
| System Admin | Manage users (block/role), manage restaurants, map admins → restaurants |

---

## LLD patterns applied

| Pattern | Where | Why |
|---|---|---|
| **State** | `modules/orders/states/*` + `factories/order-state.factory.js` | Order lifecycle: `CREATED → PAID → RESTAURANT_ACCEPTED → PREPARING → READY_FOR_PICKUP → OUT_FOR_DELIVERY → DELIVERED` with rule-based transitions |
| **Strategy + Factory** | `modules/payments/strategies/*` | UPI / Card / COD payment methods |
| **Strategy + Factory** | `modules/delivery/strategies/*` | Delivery partner assignment: Nearest / Best Rated |
| **Observer + EventBus (Singleton)** | `modules/notifications/event-bus.js` + `observers/*` | `ORDER_CREATED`, `PAYMENT_SUCCESS`, `OTP_GENERATED`, `ORDER_DELIVERED` |
| **Repository** | `core/base/base.repository.js` extended per module | Decouple Mongo from services |
| **Singleton** | DB connection, logger, event bus | Single shared instance |
| **DTO/Mapper** | `*.dto.js` + `*.mapper.js` | Domain ↔ wire boundary |

Architecture: Controller → Service → Repository → Model · No business logic in controllers · No DB queries in services.

---

## Run

### Prereqs
- Node 18+, MongoDB running locally (or set `MONGO_URI`)

### Backend
```bash
cd Backend
npm install
cp .env.example .env       # already created with defaults
npm run seed                # creates demo users, restaurants, menu
npm run dev                 # http://localhost:5001
```

### Frontend
```bash
cd Frontend
npm install
npm run dev                 # http://localhost:3000  (proxies /api → 5001)
```

### Demo Logins (password: `password123`)
| Email | Role |
|---|---|
| `admin@food.com` | System Admin |
| `john@food.com` | Customer |
| `raj@food.com` | Restaurant Admin (managing Spicy House) |
| `dev@food.com` | Delivery Partner |

---

## REST surface

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/users/me
GET    /api/users                       (admin)
PATCH  /api/users/:id/role              (admin)
PATCH  /api/users/:id/block             (admin)

GET    /api/restaurants                 (?lat=&lng= for nearby)
GET    /api/restaurants/:id
GET    /api/restaurants/mine            (restaurant admin)
POST   /api/restaurants                 (admin)
PUT    /api/restaurants/:id
PATCH  /api/restaurants/:id/assign-admin

GET    /api/menu-items/by-restaurant/:restaurantId
POST   /api/menu-items                  (restaurant/system admin)
PUT    /api/menu-items/:id
PATCH  /api/menu-items/:id/availability
DELETE /api/menu-items/:id

GET    /api/cart                        (customer)
POST   /api/cart/items
PATCH  /api/cart/items/:menuItemId
DELETE /api/cart/items/:menuItemId
DELETE /api/cart

POST   /api/orders                      (customer — places order, runs payment strategy, publishes ORDER_CREATED)
GET    /api/orders/me
GET    /api/orders/by-restaurant/:restaurantId
GET    /api/orders/:id
PATCH  /api/orders/:id/status           (state pattern guards transitions + role)
PATCH  /api/orders/:id/assign           (runs assignment strategy)

GET    /api/delivery/me                 (delivery partner)
PATCH  /api/delivery/me/availability
GET    /api/delivery/me/orders
POST   /api/delivery/orders/:id/accept
POST   /api/delivery/orders/:id/reject
POST   /api/delivery/orders/:id/verify-otp
GET    /api/delivery/partners           (admin/restaurant admin)
```

---

## Frontend route map

| Path | Role | Page |
|---|---|---|
| `/login`, `/register` | public | Auth |
| `/customer` | Customer | Home (restaurants) |
| `/customer/restaurants/:id` | Customer | Restaurant + menu |
| `/customer/menu-items/:id` | Customer | Item details |
| `/customer/cart` | Customer | Cart |
| `/customer/checkout` | Customer | Payment + place order |
| `/customer/orders` | Customer | History |
| `/customer/orders/:id` | Customer | Live tracking (polls every 4s) |
| `/customer/otp/:id` | Customer | OTP screen |
| `/restaurant` | Restaurant Admin | Dashboard |
| `/restaurant/menu` | Restaurant Admin | Menu CRUD |
| `/restaurant/orders` | Restaurant Admin | Incoming orders |
| `/restaurant/orders/:id/status` | Restaurant Admin | State transitions |
| `/restaurant/orders/:id/assign` | Restaurant Admin | Strategy picker |
| `/delivery` | Delivery Partner | Dashboard + availability toggle |
| `/delivery/available` | Delivery Partner | Accept/reject ready orders |
| `/delivery/ongoing` | Delivery Partner | Ongoing deliveries |
| `/delivery/otp/:id` | Delivery Partner | Enter OTP to complete |
| `/admin` | System Admin | Stats dashboard |
| `/admin/users` | System Admin | User list (role + block) |
| `/admin/restaurants` | System Admin | Restaurant list |
| `/admin/restaurants/:id/mapping` | System Admin | Map admin → restaurant |

---

## End-to-end happy path

1. Customer (`john@food.com`) browses **Spicy House**, adds **Masala Dosa** + **Idli Sambar** to cart.
2. Checks out with **UPI** → `processPayment` runs `UpiStrategy` → Payment SUCCESS → status auto-advances `CREATED → PAID`. Observer fires order/payment notifications (logged to server console).
3. Restaurant Admin (`raj@food.com`) sees the order, transitions `PAID → RESTAURANT_ACCEPTED → PREPARING → READY_FOR_PICKUP`.
4. Restaurant Admin opens **Assign Delivery**, picks **Nearest** → `NearestPartnerStrategy` picks `dev@food.com`.
5. Delivery Partner sees task → **Accept** → status `READY_FOR_PICKUP → OUT_FOR_DELIVERY`. A 4-digit OTP is generated and pushed to customer (visible in server logs).
6. Customer sees `OUT_FOR_DELIVERY` and the **OTP screen** banner.
7. Delivery Partner enters the OTP on `/delivery/otp/:id` → state → `DELIVERED`, partner becomes available again, earnings tick up.

The State pattern blocks invalid transitions (e.g. customer trying to mark `DELIVERED`, or admin trying to skip steps).
