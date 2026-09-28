# Search Module

## Responsibility
The HTTP face of search: request shaping, permission filtering, response
mapping, type-ahead. It contains **no query logic** — that is `modules/query`.

That separation is the Dependency Inversion point chat.md asks for: replacing
`QueryExecutor` with an Elasticsearch-backed implementation would leave this
module untouched.

## Public API
| Export | Purpose |
|---|---|
| `SearchService.search(body, actor)` | `POST /search` → `{records, plan, total, page, limit}` |
| `SearchService.suggest({objectId, fieldId, prefix})` | `GET /search/suggest`, served by the TRIE |

## Patterns
| Pattern | Where | Why |
|---|---|---|
| **Facade** | `search.service.js` | One call in front of parser → optimizer → executor → resolver → mapper. |
| **Builder** | uses `QueryBuilder` | The request body is normalised into a spec rather than passed around raw. |

## Permission behaviour
Object-level access is enforced by route middleware using `body.objectId`.
Field-level access is enforced here: filtering on a field the role cannot see
returns `NOT_FOUND` for that field rather than `PERMISSION_DENIED`, so the API
does not confirm the existence of hidden fields.

## The `plan` object
Always returned, always measured. See `modules/query/README.md` for the strategy
vocabulary. `tookMs` is a real `process.hrtime` delta covering parse → optimize →
index probes → intersect → sort → page fetch.
