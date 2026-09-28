# View Module

## Responsibility
Saved views — a named, per-user, per-object query spec (`filters`, `logic`,
`sort`, `columns`, `isDefault`).

## Public API
| Export | Endpoint |
|---|---|
| `ViewService.list(objectId, actor)` | `GET /views?objectId=` |
| `ViewService.create(body, actor)` | `POST /views` |
| `ViewService.update(viewId, patch, actor)` | `PATCH /views/:viewId` |
| `ViewService.remove(viewId, actor)` | `DELETE /views/:viewId` |

## Patterns
| Pattern | Where | Why |
|---|---|---|
| **Repository** | `view.repository.js` | Includes `clearDefault(userId, objectId)` so "exactly one default per user per object" is enforced in one place. |
| **Ownership guard** | `ViewService.#own` | A view belongs to its creator; another user gets `PERMISSION_DENIED`, not `NOT_FOUND`. |

## Note
A saved view stores the *same* filter shape `POST /search` accepts, so replaying
one is `QueryBuilder.for(view.objectId).withFilters(view.filters)…` with no
translation layer. That is the payoff for having a normalised query spec.
