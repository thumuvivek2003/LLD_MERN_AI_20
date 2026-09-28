# User Module

## Responsibility
Identity only. There is no authentication in this platform by design
(CONTRACT.md §2): the caller sends `x-user-id` and the frontend offers a user
switcher. That removes auth complexity while keeping RBAC fully exercised —
chat.md's explicit recommendation.

## Public API
| Export | Endpoint |
|---|---|
| `UserService.list()` | `GET /users` — the switcher; open, no header required |
| `UserService.me(actor)` | `GET /me` — identity + the full permission matrix |
| `UserService.assignRole(userId, roleId)` | `PATCH /users/:userId` |

## Patterns
| Pattern | Where | Why |
|---|---|---|
| **Middleware** | `core/middleware/identity.middleware.js` | Resolves `x-user-id` into `req.actor = {userId, name, role, roleId}` once per request. `GET /users` and `GET /system/health` are the two open routes — the switcher and the health probe must work before an identity exists. |
| **Repository** | `user.repository.js` | Includes `countByRoleId` for the roles screen. |

## Seeded users (fixed ids, CONTRACT.md §2)
| userId | role | roleId | can |
|---|---|---|---|
| `u_admin` | PLATFORM_ADMIN | `role_admin` | everything (`"*"` matrix) |
| `u_sales` | BUSINESS_USER | `role_sales` | full CRUD on customer / sales_order / lead / activity; Employee.Salary hidden |
| `u_hr` | BUSINESS_USER | `role_hr` | full CRUD on employee; read elsewhere |
| `u_employee` | BUSINESS_USER | `role_employee` | read everything, create/update activities only |
| `u_system` | SYSTEM | `role_system` | read + update (jobs, cache); no metadata authoring |
