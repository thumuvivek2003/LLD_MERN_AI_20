# Index Module

## Responsibility
Turn field metadata into queryable secondary indexes, keep them in step with
record writes, and answer `(objectId, fieldId, operator, value) → Set<recordId>`.

This is the module that makes chat.md's central claim true: **searching never
touches `recordJson`.** Storage (Mongo) and search (the index layer) are
separate concerns, exactly as the enterprise architecture section describes.

## Public API
| Export | Purpose |
|---|---|
| `IndexManager.loadAll()` | mirror persisted indexes into memory at boot |
| `IndexManager.ensureIndex(objectId, fieldId, type?)` | create the definition |
| `IndexManager.build(indexId)` / `buildForObject` / `rebuildAll` | (re)build from records |
| `IndexManager.applyRecordChange({objectId, recordId, before, after})` | incremental upkeep |
| `IndexManager.query(objectId, fieldId, operator, value)` | the query path; `null` = no usable index |
| `IndexManager.sortedIds` / `suggest` / `cardinality` | sort pushdown, type-ahead, selectivity |
| `IndexService` | the `/indexes/*` REST surface |

## Patterns
| Pattern | Where | Why |
|---|---|---|
| **Strategy** | `strategies/{hash,btree,trie}.strategy.js` | Three completely different data structures behind one `IIndexStrategy`. The manager asks `supports(operator)`, never `if (type === 'HASH')`. |
| **Factory** | `strategies/index-strategy.registry.js` | Chooses the structure from the field's declared index type. GEO is declared in the contract and unimplemented — adding it is one file and one line. |
| **Manager / Facade** | `index.manager.js` | Single owner of the memory ⇄ Mongo duality. Callers never see either half. |
| **Collaborator split** | `index.builder.js` | The manager owns *which indexes exist and how they are queried*; the builder owns *how records become index entries*. Two reasons to change, two files. `buildMany` reads an object's records once and feeds every strategy, instead of one full pass per index. |
| **Repository** | `index.repository.js` | `IndexDefinition` and `IndexEntry` persistence. |

## Which structure, and why
| Field types | Index | Answers |
|---|---|---|
| TEXT, TEXTAREA | `TRIE` | `startsWith` via prefix walk, `contains` via inverted-token vocabulary scan, `eq`, `endsWith`, suggest |
| NUMBER, CURRENCY, DATE, DATETIME | `BTREE` | sorted key array + binary search: `gt/gte/lt/lte/between`, and ordered iteration for sort pushdown |
| everything else | `HASH` | O(1) `eq` / `in` — picklists, booleans, emails, lookups |

`TRIE.contains` scans the distinct **vocabulary** (values + tokens), not the
records — a few thousand strings instead of a few thousand documents, and it
does not grow with record count.

## Storage shape
`indexentries`: `{ indexId, objectId, fieldId, key, recordIds[] }` — one row per
distinct key, uniquely indexed on `{indexId, key}`. Every strategy serialises to
this same shape, so persistence code is written once.

## Write path
Memory is updated **synchronously** so the very next query is correct; Mongo is
updated in the background via `bulkWrite` so record writes stay fast. This is
the "writes 5ms slower, reads 500ms faster" trade chat.md argues for.

Indexes are never built on demand by a search. They are built when a field
becomes indexed (`field.searchable.enabled` → subscriber) and maintained by
`record.*` events.
