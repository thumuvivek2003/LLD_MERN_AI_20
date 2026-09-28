# Cache Module

## Responsibility
Serve object + field metadata to every other engine without a Mongo round-trip,
and report honestly on itself.

## Public API
| Export | Purpose |
|---|---|
| `MetadataCache.getInstance(objectRepository, {ttlSeconds})` | the one instance |
| `getObject(objectId)` / `getAllObjects()` / `getField(objectId, fieldId)` | read-through accessors |
| `invalidate(objectId)` / `clear()` / `refresh()` | eviction and warming |
| `stats()` | powers `GET /system/cache` |

## Patterns
| Pattern | Where | Why |
|---|---|---|
| **Singleton** | `MetadataCache.getInstance` | `/system/cache` and `POST /system/cache/refresh` must observe and warm the *same* instance the record engine reads from. A module-level object would work until a second instance appeared in a test or a script; the private static makes that impossible. |
| **Proxy / read-through** | `getObject` | Callers cannot tell whether a value came from RAM or Mongo, so nothing above depends on caching being present. |
| **Observer (subscriber side)** | `core/event-bus/subscribers/cache.subscriber.js` | Invalidation is driven by `object.*` / `field.*` events. The object service never calls the cache. |

## Invalidation rules
Every event in `MetadataCache.invalidatingEvents()` evicts the affected
`objectId` and the "all objects" list. Records do **not** invalidate metadata —
record writes change data, not schema, which is exactly why a metadata cache is
safe to keep hot in this architecture.

## Note
Entries carry a timestamp and expire after `cacheTtlSeconds` (from
`/system/settings`), so even a missed invalidation self-heals.
