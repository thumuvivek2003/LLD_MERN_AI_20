# MetaForce — Backend

> A metadata-driven CRM platform engine. Objects → Fields → Records → Lookups → Index → Search.
>
> Not a Salesforce clone — the **metadata engine that would power one**. The schema
> (Object Master) and the data (Record JSON) evolve independently, search is served
> by a purpose-built index layer rather than by scanning JSON, and every engine
> talks through events.

Node 18+ · Express 4 · Mongoose 8 · ES modules only · `mongodb://127.0.0.1:27017/metaforce` · port **4000**

---

## Setup

```bash
cd CRM/Backend
npm install
npm run seed      # drops + recreates the database, ~10s, prints counts
npm start         # or: npm run dev   (node --watch)
```

Requires a MongoDB listening on `127.0.0.1:27017`. Configuration lives in `.env`
(`PORT`, `MONGODB_URI`, `CLIENT_ORIGIN`, `NODE_ENV`, `APP_VERSION`).

Every request carries `x-user-id: u_admin | u_sales | u_hr | u_employee | u_system`.
Only `GET /api/users` and `GET /api/system/health` work without it.

```bash
curl -H 'x-user-id: u_admin' localhost:4000/api/system/overview
curl -H 'x-user-id: u_sales' -H 'content-type: application/json' \
     -d '{"objectId":"customer","filters":[{"fieldId":"f4","operator":"eq","value":"Hyderabad"}]}' \
     localhost:4000/api/search
```

---

## Architecture

```
                       ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
   ACTORS              │PLATFORM ADMIN│  │BUSINESS USER │  │    SYSTEM    │
                       └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
                              │   x-user-id     │                 │
   ─────────────────────────  ▼  ───────────────▼─────────────────▼─────────────
                       identity.middleware ─► permission.middleware ─► routes
                              │
   ┌──────────────────────────┴────────────────────────────────────────────────┐
   │  CORE ENGINES                                                             │
   │                                                                           │
   │  ┌──────────┐ ┌──────────┐ ┌────────────┐ ┌──────────┐ ┌──────────┐       │
   │  │  OBJECT  │ │  FIELD   │ │ VALIDATION │ │  RECORD  │ │  LOOKUP  │       │
   │  │  State   │ │ Factory  │ │  Strategy  │ │ Builder  │ │  Graph   │       │
   │  │ Versions │ │ Registry │ │  Registry  │ │Bulk/Impt │ │ Cascade  │       │
   │  └────┬─────┘ └────┬─────┘ └─────┬──────┘ └────┬─────┘ └────┬─────┘       │
   │       │            │             │             │            │             │
   │  ┌────┴─────┐ ┌────┴─────┐ ┌─────┴──────┐ ┌────┴─────┐ ┌────┴─────┐       │
   │  │  SEARCH  │ │  QUERY   │ │   INDEX    │ │PERMISSION│ │  SYSTEM  │       │
   │  │  Facade  │ │Composite │ │  Strategy  │ │  Matrix  │ │Jobs/Health│      │
   │  │          │ │Optimizer │ │  Manager   │ │  Mapper  │ │ Metrics  │       │
   │  └────┬─────┘ └────┬─────┘ └─────┬──────┘ └────┬─────┘ └────┬─────┘       │
   │       │            │             │             │            │             │
   │  ┌────┴────────────┴─────────────┴─────────────┴────────────┴─────┐       │
   │  │            EVENT BUS  (Observer, in-process)                    │      │
   │  │   index · audit · cache · monitor · log   subscribers            │      │
   │  └────┬────────────┬─────────────┬─────────────┬────────────┬─────┘       │
   └───────┼────────────┼─────────────┼─────────────┼────────────┼─────────────┘
           │            │             │             │            │
      ┌────▼────┐  ┌────▼────┐  ┌─────▼─────┐  ┌────▼────┐  ┌────▼──────┐
      │METADATA │  │ RECORD  │  │   INDEX   │  │  AUDIT  │  │ METADATA  │
      │  STORE  │  │  STORE  │  │   STORE   │  │  STORE  │  │   CACHE   │
      │ objects │  │ records │  │indexentries│ │auditlogs│  │(Singleton)│
      │ +fields │  │recordJson│ │ + in-RAM  │  │         │  │  in-RAM   │
      └─────────┘  └─────────┘  └───────────┘  └─────────┘  └───────────┘
                          MongoDB  ·  metaforce
```

### The two ideas everything rests on

**1. Field IDs, not field names.** A record stores `{ "f1": "Ravi Kumar" }`.
Renaming "Customer Name" to "Full Name" edits one metadata document and touches
zero of the 4 000 customer records.

**2. Storage and search are separate concerns.** `recordJson` is the truth;
the index layer is the query-optimised representation. A filter on
`City = Hyderabad` never reads a record document — it probes a hash map, gets
record ids, and fetches only the 25 documents on the requested page.

---

## Module map

```
src/
├── server.js               bootstrap: connect → container → warm cache → warm indexes → listen
├── app.js                  express wiring; attaches the container to every request
├── container.js            COMPOSITION ROOT — all constructor injection happens here
├── config/                 env, db, constants (every CONTRACT.md §3 enum)
├── routes/index.js         /api mount table
├── core/
│   ├── base/               api.response, asyncHandler, BaseRepository
│   ├── interfaces/         IRepository IValidator IIndexStrategy ICache IEventBus
│   ├── exceptions/         AppError + NotFound/Validation/Permission/Conflict/BadRequest
│   ├── middleware/         identity, request-log, error
│   ├── event-bus/          InProcessEventBus + 5 subscribers
│   └── utils/              logger, ULID ids, pagination, slug, csv, diff
├── modules/
│   ├── object/             lifecycle (State), versioning, clone
│   ├── field/              13 type descriptors (Factory), field CRUD, reorder
│   ├── validation/         10 validators (Strategy), factory, registry
│   ├── record/             Builder, single/bulk/import/export
│   ├── lookup/             resolver, reverse relationships, guard, cascade, graph
│   ├── index/              3 index strategies, IndexManager, index REST
│   ├── query/              parser → Composite tree → optimizer → executor
│   ├── search/             /search facade + suggest
│   ├── permission/         matrices, middleware, field-access mapper
│   ├── cache/              MetadataCache (Singleton)
│   ├── event/              event ring buffer / history
│   ├── audit/              diff-based audit trail
│   ├── view/               saved views
│   ├── user/               identity + user switcher
│   └── system/             health, metrics, jobs, scheduler, logs, alerts, storage
└── scripts/seed.js         idempotent seed (drop + recreate)
```

Every module folder has its own `README.md` explaining responsibility, public API
and the patterns it uses.

---

## Engine responsibilities

| Engine | Module | Owns |
|---|---|---|
| **Object Engine** | `object` | Object identity, embedded field list, DRAFT→PUBLISHED→ARCHIVED lifecycle, versioning with stored diffs, clone |
| **Field Engine** | `field` | One descriptor per FIELD_TYPE: coercion, index type, index keys, sort value, display; `GET /field-types` generated from the registry |
| **Validation Engine** | `validation` | 10 rule strategies; produces the `VALIDATION_ERROR.details[]` array |
| **Record Engine** | `record` | Record construction (Builder), soft delete/restore, bulk with per-row errors, import with mapping + dryRun, CSV/JSON export |
| **Lookup Engine** | `lookup` | Forward resolution (`resolved`), reverse relationships (computed, never stored), cycle prevention, RESTRICT/CASCADE/SET_NULL, relationship graph |
| **Index Engine** | `index` | HASH / BTREE / TRIE strategies, IndexManager (build, incremental upkeep, query), Mongo persistence + in-memory mirror |
| **Query Engine** | `query` | filters → Composite expression tree → optimizer → executor; produces the measured `plan` |
| **Search Engine** | `search` | HTTP facade, permission filtering, type-ahead |
| **Permission Engine** | `permission` | Role → object CRUD, role → field HIDDEN/READ/WRITE; middleware + mapper |
| **Event Engine** | `event` + `core/event-bus` | In-process Observer bus, all 22 EVENT_TYPEs, 5 subscribers |
| **Audit Engine** | `audit` | Old-vs-new field-level diffs, written by an event subscriber |
| **Metadata Cache** | `cache` | Singleton read-through cache with hit/miss/eviction counters |
| **System** | `system` | Health, metrics, job registry + scheduler, log ring buffer, alerts, storage, settings |

---

## Pattern → file

| Pattern | Where | What it buys |
|---|---|---|
| **Repository** | `core/base/base.repository.js` + `modules/*/*.repository.js` | The only layer that touches Mongoose. No service imports a model. |
| **Factory** — field types | `modules/field/types/field-type.registry.js` + 13 `*.type.js` | New field type = one file + one array entry. `/field-types` is generated. |
| **Factory** — validators | `modules/validation/validation.factory.js` | Selects strategies by asking `appliesTo(field)`, never by switching on type. |
| **Factory** — index strategies | `modules/index/strategies/index-strategy.registry.js` | GEO is declared in the contract and unimplemented; adding it is one file + one line. |
| **Factory** — states | `modules/object/states/object-state.factory.js` | status string → State instance. |
| **Strategy** — validation | `modules/validation/validators/*.validator.js` (10) | One rule per file behind `IValidator`. |
| **Strategy** — indexing | `modules/index/strategies/{hash,btree,trie}.strategy.js` | Three data structures behind `IIndexStrategy`. |
| **Strategy** — operators | `modules/query/operators/operator.registry.js` | 13 operators, each with an in-memory `evaluate` for the residual path. |
| **Builder** — record | `modules/record/record.builder.js` | Makes type coercion unavoidable; handles create vs partial-merge in one place. |
| **Builder** — query | `modules/query/query.builder.js` | Search endpoint, record list and saved views assemble the same spec. |
| **Observer** | `core/event-bus/event-bus.js` + `subscribers/*` | Record writes trigger indexing, audit, cache eviction and monitoring without the record service knowing. |
| **Composite** | `modules/query/nodes/{and,or,comparison}.node.js` | Nested filter groups work today even though the UI sends a flat list. |
| **Interpreter** | `ExpressionNode.execute(ctx)` | Each node evaluates itself against the index layer. |
| **Singleton** | `modules/cache/metadata.cache.js` | `/system/cache` reports on the same instance the record engine reads from. |
| **State** | `modules/object/states/*.state.js` | Lifecycle rules in three classes instead of `if (status === …)` in five services. |
| **Facade** | `modules/index/index.manager.js`, `modules/search/search.service.js` | Hide the memory⇄Mongo duality and the parse→optimize→execute chain. |
| **Mapper** | `*.mapper.js`, `field-access.mapper.js` | Contract shaping and field-level masking in one place each. |

---

## SOLID, concretely

**S — one reason to change.**
`record.service.js` (single record), `record-bulk.service.js` (batches),
`record-export.service.js` (serialisation) are three files because they change for
three different reasons. Same split for `object.service` vs `object-version.service`,
and for `lookup.{resolver,guard,cascade,relationship,service}`.

**O — extend by adding, not editing.**
Four extension points, all tested by actually using them:

| To add… | You write | You edit |
|---|---|---|
| a field type | `types/duration.type.js` | one line in `field-type.registry.js` |
| a validation rule | `validators/phone-format.validator.js` | one line in `validator.registry.js` |
| an index type | `strategies/geo.strategy.js` | one line in `index-strategy.registry.js` |
| an operator | — | one entry in `operator.registry.js` |

No engine file, no `switch`, no `if/else` chain changes in any of those cases.

**L — substitutability.**
Every validator is an `IValidator`; the engine calls `validate(ctx)` and cannot
tell them apart. Every index strategy is an `IIndexStrategy`; `IndexManager` asks
`supports(operator)` and never `type === 'HASH'`. `CurrencyFieldType extends
NumberFieldType` and `MultiPicklistFieldType extends PicklistFieldType` are real
subtype relationships, not code reuse hacks.

**I — small interfaces.**
`core/interfaces/` holds five, each 3–8 methods: `IRepository`, `IValidator`,
`IIndexStrategy`, `ICache`, `IEventBus`. Each throws `NotImplementedError`, so a
half-finished implementation fails loudly. `IIndexStrategy` is deliberately
narrow enough that a hash map can implement it without stub methods —
`sortedRecordIds` and `suggest` have sensible base returns.

**D — depend on abstractions.**
`src/container.js` is the composition root: every repository and service is
constructed there and injected through constructors. Grep proves it:

```bash
grep -rn "\.model\.js'" src/modules/*/[a-z]*.service.js   # → no matches
```

No service imports a Mongoose model, and no service imports another service's
singleton. Replacing Mongo with Postgres means new repositories; replacing the
in-process bus with Kafka means one new `IEventBus`.

---

## Endpoint table

All paths are prefixed `/api`. `:oid` = objectId, `:rid` = recordId.

### Identity
| Method | Path | Notes |
|---|---|---|
| GET | `/users` | open — no `x-user-id` required |
| GET | `/me` | identity + full permission matrix |
| PATCH | `/users/:userId` | `{roleId}` |

### Objects
| Method | Path | Notes |
|---|---|---|
| GET | `/objects` | `?q&status&page&limit&sort&order`; filtered to objects the role can read |
| POST | `/objects` | created as DRAFT |
| GET | `/objects/:oid` | includes `fields[]` and `lifecycle` |
| PATCH | `/objects/:oid` | label/pluralLabel/description/icon/color/primaryDisplayFieldId |
| DELETE | `/objects/:oid` | 409 if it has records or inbound lookups |
| POST | `/objects/:oid/publish` · `/archive` · `/restore` | State-gated transitions |
| POST | `/objects/:oid/clone` | `{label, apiName, includeRecords}` |
| GET | `/objects/:oid/versions` | `[{version, changedAt, changedBy, summary, diff[]}]` |
| GET | `/objects/:oid/stats` | `{recordCount, activeCount, archivedCount, indexCount, lastActivityAt}` |
| GET | `/objects/:oid/references` | inbound lookup fields *(extension — see below)* |

### Fields
| Method | Path | Notes |
|---|---|---|
| GET | `/field-types` | generated from the type registry |
| GET | `/objects/:oid/fields` | ordered |
| POST | `/objects/:oid/fields` | server assigns `fieldId` + `order` |
| PATCH | `/objects/:oid/fields/:fid` | 409 on type change when records exist |
| DELETE | `/objects/:oid/fields/:fid` | 409 if primary display or a lookup display field |
| PUT | `/objects/:oid/fields/reorder` | `{order:["f3","f1","f2"]}` |

### Records
| Method | Path | Notes |
|---|---|---|
| GET | `/objects/:oid/records` | `?page&limit&sort&order&status&q`; `data` is an array, `meta.plan` carries the query plan |
| POST | `/objects/:oid/records` | `{recordJson}` → 422 with `details[]` on failure |
| GET | `/objects/:oid/records/:rid` | includes `resolved` |
| PATCH | `/objects/:oid/records/:rid` | partial merge |
| POST | `/objects/:oid/records/:rid/archive` · `/restore` | soft delete; archive applies `onDelete` cascade |
| GET | `/objects/:oid/records/:rid/related` | reverse lookups with counts + previews |
| GET | `/objects/:oid/records/:rid/history` | audit entries for this record |
| POST | `/objects/:oid/records/bulk` | `{action, recordIds, patch}` → `{processed, succeeded, failed, errors[]}` |
| POST | `/objects/:oid/records/import` | `{rows, mapping, dryRun}` → adds `preview[]` when `dryRun` |
| GET | `/objects/:oid/records/import/sample` | column→field template *(extension)* |
| GET | `/objects/:oid/records/export` | `?format=csv\|json&fieldIds=&recordIds=` |

### Search & views
| Method | Path | Notes |
|---|---|---|
| POST | `/search` | `data:{records, plan}`; plan is measured, never faked |
| GET | `/search/suggest` | `?objectId&fieldId&prefix` — TRIE-served |
| GET/POST | `/views` · PATCH/DELETE `/views/:viewId` | saved views, per user |

### Indexes
| Method | Path | Notes |
|---|---|---|
| GET | `/indexes` | `?objectId&status` |
| GET | `/indexes/summary` | `{total, healthy, building, failed, inactive}` |
| POST | `/indexes` | `{objectId, fieldId, type?}` — builds immediately |
| GET | `/indexes/:indexId` | + `history[]` and `performance{}` |
| POST | `/indexes/:indexId/rebuild` | async → returns a job |
| POST | `/indexes/rebuild-all` | async → returns a job |
| DELETE | `/indexes/:indexId` | |

### Lookups
| Method | Path | Notes |
|---|---|---|
| GET | `/lookups/options` | `?objectId&q&limit` — picker options |
| GET | `/lookups/graph` | `{nodes[], edges[]}` |
| GET | `/lookups/stats` | resolution rate + recent failures |

### Permissions & audit
| Method | Path | Notes |
|---|---|---|
| GET/POST | `/roles` · PATCH/DELETE `/roles/:roleId` | |
| GET/PUT | `/permissions` | `?roleId=`; defaults to the caller's role |
| GET | `/audit` | `?objectId&recordId&userId&action&from&to&page&limit` |
| GET | `/audit/recent` | activity feed *(extension)* |

### System
| Method | Path |
|---|---|
| GET | `/system/health` (open) · `/metrics` · `/overview` |
| GET | `/system/events` · `/system/events/types` *(extension)* |
| GET | `/system/jobs` · POST `/system/jobs/:jobId/run` |
| GET | `/system/cache` · POST `/system/cache/refresh` · DELETE `/system/cache` |
| GET | `/system/validation/stats` · `/system/index/stats` *(extension)* |
| GET | `/system/logs` · `/system/logs/summary` |
| GET | `/system/alerts` · POST `/system/alerts/:alertId/ack` |
| GET | `/system/storage` · GET/PATCH `/system/settings` |

**Extensions** are additive endpoints that follow the contract's naming
conventions; no contract-specified path, shape or enum was changed.

---

## Seeded data

`npm run seed` drops and recreates the database in about 10 seconds.

| | |
|---|---|
| Objects | 10 — 8 PUBLISHED, 1 DRAFT (Campaign), 1 ARCHIVED (Support Ticket) |
| Fields | 60 across 13 types, including 7 lookup relationships |
| Records | ~24 300 — Customer 4 000, Sales Order 3 500, Invoice 2 800, Product 1 200, Lead 5 000, Activity 7 000, Account 300, Employee 400, Support Ticket 120 |
| Indexes | 50, built in one pass per object (~47 000 key entries) |
| Audit | ~580 rows with real field-level diffs |
| Events / logs / alerts | 320 / 148 / 5 |
| Users / roles | 5 / 5 with a realistic permission matrix |
| Saved views | 3 for `u_sales` |

Indian names and cities throughout (Ravi Kumar, Sneha Reddy, Arjun Das,
Priya Sharma, Karan Mehta · Hyderabad, Bangalore, Chennai, Pune, Delhi).
About 2% of records are ARCHIVED so the archive screens have data.

The relationship graph the seed produces:

```
account ◄── customer ◄── sales_order ◄── invoice
                ▲             ▲              │
                │             └──────────────┘
                └── activity (CASCADE)
    customer→account SET_NULL · order/invoice→customer RESTRICT · order→product SET_NULL
```

## Notes and deliberate omissions

- **GEO index** is declared in `INDEX_TYPE` per the contract and intentionally not
  implemented; `indexStrategyFactory` returns a clear 400 for it.
- **No tests.** The verification for this build was end-to-end curl against every
  route group.
- **Indexing is synchronous in memory, asynchronous to Mongo.** The in-RAM
  structure is updated before a write returns (so the next query is correct);
  the `indexentries` bulkWrite is fired without awaiting. `settings.indexingMode`
  records the intent.
- **`storage.totalBytes` and `eventBus.partitions`** are the only invented values
  in `/system/*` — a single-node Mongo exposes no volume size and the in-process
  bus has no partitions. Both are marked in code.
