# Record Module

## Responsibility
The Record Store from `main_flow.png`: create, read, update, archive, restore,
bulk, import, export. Values live under **field IDs** (`recordJson.f1`), never
field names — the single design decision chat.md builds everything else on.

Split into three services so each has one reason to change:

| File | Owns |
|---|---|
| `record.service.js` | one record at a time |
| `record-bulk.service.js` | many records, per-row error collection, import |
| `record-export.service.js` | CSV / JSON serialisation |

## Public API
| Export | Purpose |
|---|---|
| `RecordService.list / get / create / update / archive / restore / history` | single-record lifecycle |
| `RecordService.context(objectId, actor)` | `{objectDef, access, state}` — the shared preamble |
| `RecordBulkService.bulk / import / sample` | `/records/bulk`, `/records/import` |
| `RecordExportService.export` | `/records/export` |
| `RecordBuilder` / `RecordMapper` | construction and contract shaping |

## Patterns
| Pattern | Where | Why |
|---|---|---|
| **Builder** | `record.builder.js` | Constructing a record needs metadata + raw input + an existing record (for partial merges) + actor + object version + defaults. A 6-argument constructor would be unreadable and every caller would have to remember the coercion step; the builder makes coercion unavoidable. |
| **Mapper** | `record.mapper.js` | The only place that shapes a Record document, and the only place field-level masking is applied on the way out. |
| **Repository** | `record.repository.js` | Includes a streaming `cursorByObject` so the index builder never materialises 7 000 documents in one array. |

## Response shape note
`GET /objects/:oid/records` returns `data` as an **array** (consistent with every
other paginated list in the contract) and puts the measured query plan in
`meta.plan`. `POST /search` uses the explicitly-specified `data: {records, plan}`.

## Write path
```
input ─► RecordBuilder (coerce)  ─► ValidationService (rules) ─► repository.create
                                                                        │
                                                             publish record.created
                                                                        │
                                        ┌───────────────┬───────────────┴───────┐
                                   IndexManager     AuditService          EventMonitor
```
The service never calls the index or audit layer. It publishes, and subscribers react.

## Bulk semantics
Every bulk row runs through the *same* single-record path inside its own
try/catch. A separate "fast" bulk path would inevitably drift from the real
validation rules; per-row error collection is worth the extra round-trips.

`import` additionally passes a `batchSeen` set to the unique validator, because
rows inside one batch are not yet persisted and can only be de-duplicated in memory.
