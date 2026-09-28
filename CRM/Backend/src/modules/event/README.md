# Event Module

## Responsibility
Event history for the System console's Event Monitor. The **bus itself** lives in
`core/event-bus/` because it is infrastructure every module depends on; this
module is the read model over it.

## Public API
| Export | Purpose |
|---|---|
| `EventService.record(envelope)` | push into the ring buffer (called by the monitor subscriber) |
| `EventService.persist(row)` | mirror to Mongo, fire-and-forget |
| `EventService.list({type, limit})` | `GET /system/events` |
| `EventService.typeCounts()` | `GET /system/events/types` |

## Patterns
| Pattern | Where | Why |
|---|---|---|
| **Observer** | `core/event-bus/event-bus.js` | `InProcessEventBus` implements `IEventBus`. Publishers never know their subscribers. Handlers run in a microtask and their failures are counted, never propagated — a slow audit writer cannot break a record write. |
| **Ring buffer** | `event.service.js` | A bounded array is the read path (instant, no query); Mongo is the archive so history survives a restart. |

## The five subscribers (`core/event-bus/subscribers/`)
| Subscriber | Reacts to | Does |
|---|---|---|
| `index.subscriber` | `record.*`, `field.searchable.enabled`, `field.deleted`, `object.published` | keeps indexes in step; auto-builds on searchable |
| `audit.subscriber` | 15 mapped event types | writes `auditlogs` rows with field-level diffs |
| `cache.subscriber` | `object.*`, `field.*` | evicts metadata; publishes `cache.invalidated` |
| `monitor.subscriber` | **everything** | ring buffer + Mongo mirror |
| `log.subscriber` | lifecycle / index / failure events | promotes notable events to the log stream |

## Why this matters for the design
It is the mechanism that keeps the engines decoupled. `RecordService` has no
reference to `IndexManager` or `AuditService`; `FieldService` has no reference to
`IndexManager`. Swapping this bus for Kafka is one new `IEventBus` implementation
and one line in the container — exactly the migration path chat.md sketches.
