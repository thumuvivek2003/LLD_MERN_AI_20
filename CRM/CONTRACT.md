# MetaForce — Shared Contract (Frontend ⇄ Backend)

> Metadata-driven CRM platform. Objects → Fields → Records → Lookups → Index → Search.
> This file is the **single source of truth** for both the Backend and Frontend agents.
> Neither side may invent an endpoint, enum value, or payload shape that is not here.
> If something is genuinely missing, follow the naming conventions here and document it in
> your module README — do not change an existing shape.

## 0. Layout & Runtime

```
CRM/
├── CONTRACT.md          # this file (do not edit)
├── Backend/             # owned by the backend agent  → http://localhost:4000
└── Frontend/            # owned by the frontend agent → http://localhost:5173
```

- Node 18+, **ES modules everywhere** (`"type": "module"` in both package.json files).
- Backend: Express 4 + Mongoose 8 + MongoDB (`mongodb://127.0.0.1:27017/metaforce`).
- Frontend: React 18 + Vite 5 + Tailwind 3 + react-router-dom 6 + axios + lucide-react.
- Vite dev proxy: `/api` → `http://localhost:4000`. Frontend calls **relative** `/api/...` paths only.
- No JWT / no login screen. Identity is a header (see §2).

## 1. Response Envelope

Every JSON response, success or failure:

```jsonc
// success
{ "success": true, "data": <payload>, "meta": { "page": 1, "limit": 25, "total": 4215, "totalPages": 169 } }
// meta present only on paginated endpoints

// failure
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "3 fields failed validation",
  "details": [ { "fieldId": "f2", "apiName": "email", "rule": "EMAIL_FORMAT", "message": "Invalid email" } ] } }
```

Error codes: `VALIDATION_ERROR` (422), `NOT_FOUND` (404), `PERMISSION_DENIED` (403),
`CONFLICT` (409, e.g. unique violation / archived object), `BAD_REQUEST` (400),
`INTERNAL_ERROR` (500).

Pagination query params everywhere: `page` (1-based, default 1), `limit` (default 25, max 200).

## 2. Identity & RBAC

- Every request sends header **`x-user-id: <userId>`**. Frontend stores the picked user in
  `localStorage` under key `metaforce.userId` and attaches it via an axios interceptor.
- If the header is missing → `PERMISSION_DENIED`, except on `GET /api/users` and `GET /api/system/health`.
- Seeded users (fixed ids — frontend may hardcode nothing but these come from the API):

| userId | name | role | actor persona |
|---|---|---|---|
| `u_admin` | Admin User | `PLATFORM_ADMIN` | Platform Admin console |
| `u_sales` | Sales Manager | `BUSINESS_USER` | Business console |
| `u_hr` | HR Manager | `BUSINESS_USER` | Business console |
| `u_employee` | Employee | `BUSINESS_USER` (read-mostly) | Business console |
| `u_system` | System Daemon | `SYSTEM` | System console |

Role enum: `PLATFORM_ADMIN | BUSINESS_USER | SYSTEM`.

`GET /api/users` → `[{ userId, name, role, roleId, avatarInitials, title }]`
`GET /api/me` → `{ userId, name, role, roleId, permissions: { objects: {...}, fields: {...} } }`

## 3. Enums (identical strings on both sides)

```js
OBJECT_STATUS   = DRAFT | PUBLISHED | ARCHIVED
RECORD_STATUS   = ACTIVE | ARCHIVED
FIELD_TYPE      = TEXT | TEXTAREA | NUMBER | CURRENCY | EMAIL | PHONE | URL
                | DATE | DATETIME | BOOLEAN | PICKLIST | MULTI_PICKLIST | LOOKUP
INDEX_TYPE      = HASH | BTREE | TRIE | GEO        // GEO declared, not implemented
INDEX_STATUS    = ACTIVE | BUILDING | FAILED | INACTIVE
OPERATOR        = eq | neq | contains | startsWith | endsWith | gt | gte | lt | lte
                | in | between | isEmpty | isNotEmpty
FILTER_LOGIC    = AND | OR
PERMISSION_LEVEL(object) = NONE | READ | CREATE | UPDATE | DELETE   // cumulative set, stored as booleans
FIELD_ACCESS    = HIDDEN | READ | WRITE
JOB_STATUS      = QUEUED | RUNNING | COMPLETED | FAILED
LOG_LEVEL       = INFO | WARNING | ERROR | CRITICAL
AUDIT_ACTION    = CREATED | UPDATED | ARCHIVED | RESTORED | PUBLISHED | CLONED
                | DELETED | INDEX_BUILT | BULK_UPDATED | IMPORTED
EVENT_TYPE      = object.created | object.updated | object.published | object.archived | object.cloned
                | field.created | field.updated | field.deleted | field.reordered | field.searchable.enabled
                | record.created | record.updated | record.archived | record.restored | record.bulk
                | index.build.started | index.build.completed | index.entry.updated | index.deleted
                | lookup.resolved | lookup.failed | validation.failed | cache.invalidated
```

Which index type a field gets (backend decides, frontend displays):
`TEXT/TEXTAREA` → `TRIE`; `NUMBER/CURRENCY/DATE/DATETIME` → `BTREE`; everything else → `HASH`.

## 4. Core Documents

### ObjectDefinition
```jsonc
{
  "objectId": "customer",              // slug, immutable, PK used in URLs
  "label": "Customer",
  "pluralLabel": "Customers",
  "apiName": "customer",
  "description": "Stores customer related information",
  "icon": "users",                     // lucide-react icon name
  "color": "indigo",                   // indigo|emerald|amber|rose|sky|violet
  "status": "PUBLISHED",
  "version": 3,
  "primaryDisplayFieldId": "f1",       // used to render lookup chips & record titles
  "recordCount": 4215,                 // computed, read-only
  "fieldCount": 12,                    // computed, read-only
  "fields": [ Field... ],              // embedded; ordered by `order`
  "createdBy": "u_admin", "updatedBy": "u_admin",
  "createdAt": "2024-05-10T10:30:00.000Z", "updatedAt": "..."
}
```

### Field (embedded in ObjectDefinition)
```jsonc
{
  "fieldId": "f1",                     // "f<n>", unique per object, immutable, used as recordJson key
  "apiName": "customerName",
  "label": "Customer Name",
  "type": "TEXT",
  "order": 1,
  "required": true,
  "unique": false,
  "readOnly": false,
  "searchable": true,                  // flipping false→true triggers index build event
  "sortable": true,
  "filterable": true,
  "indexed": true,                     // derived: searchable || filterable || sortable
  "defaultValue": null,
  "helpText": "",
  "options": [ { "value": "ACTIVE", "label": "Active", "color": "emerald" } ],  // PICKLIST only
  "lookup": { "objectId": "account", "displayFieldId": "f1", "onDelete": "RESTRICT" }, // LOOKUP only; onDelete: RESTRICT|CASCADE|SET_NULL
  "validation": { "min": null, "max": null, "minLength": null, "maxLength": null,
                  "regex": null, "message": null }
}
```

### Record
```jsonc
{
  "recordId": "rec_01H...",            // string PK used in URLs (not _id)
  "objectId": "customer",
  "recordJson": { "f1": "Ravi Kumar", "f2": "ravi@gmail.com", "f5": "acc_101" },
  "displayName": "Ravi Kumar",         // computed from primaryDisplayFieldId, read-only
  "status": "ACTIVE",
  "objectVersion": 3,
  "createdBy": "u_sales", "updatedBy": "u_sales",
  "createdAt": "...", "updatedAt": "..."
}
```

When a record is returned for **display**, the backend also returns `resolved` for lookup fields:
```jsonc
"resolved": { "f5": { "recordId": "acc_101", "displayName": "Hitech Solutions", "objectId": "account" } }
```

## 5. REST API

All paths are prefixed `/api`. `:oid` = objectId, `:rid` = recordId.

### 5.1 Objects — Platform Admin
| Method | Path | Notes |
|---|---|---|
| GET | `/objects` | `?q=&status=&page=&limit=&sort=label&order=asc` → paginated list (no `fields[]`, but `fieldCount`/`recordCount`) |
| POST | `/objects` | body: `{label, pluralLabel, apiName, description, icon, color, fields?}` → created as `DRAFT` |
| GET | `/objects/:oid` | full object incl. `fields[]` |
| PATCH | `/objects/:oid` | label/description/icon/color/primaryDisplayFieldId |
| DELETE | `/objects/:oid` | 409 if it has records or is referenced by a lookup |
| POST | `/objects/:oid/publish` | DRAFT → PUBLISHED |
| POST | `/objects/:oid/archive` | PUBLISHED → ARCHIVED |
| POST | `/objects/:oid/restore` | ARCHIVED → PUBLISHED |
| POST | `/objects/:oid/clone` | body `{label, apiName, includeRecords:false}` |
| GET | `/objects/:oid/versions` | `[{version, changedAt, changedBy, summary, diff[]}]` |
| GET | `/objects/:oid/stats` | `{recordCount, activeCount, archivedCount, indexCount, lastActivityAt}` |

### 5.2 Fields
| Method | Path | Notes |
|---|---|---|
| GET | `/field-types` | metadata catalogue driving the "Add Field" UI: `[{type, label, icon, supports:{required,unique,options,lookup,validation:[...]}}]` |
| GET | `/objects/:oid/fields` | ordered |
| POST | `/objects/:oid/fields` | body = Field minus `fieldId`/`order`; server assigns both |
| PATCH | `/objects/:oid/fields/:fid` | any mutable prop; `type` change 409s if records exist |
| DELETE | `/objects/:oid/fields/:fid` | 409 if referenced by a lookup `displayFieldId` |
| PUT | `/objects/:oid/fields/reorder` | body `{ order: ["f3","f1","f2"] }` |

### 5.3 Records — Business User
| Method | Path | Notes |
|---|---|---|
| GET | `/objects/:oid/records` | `?page&limit&sort=<fieldId>&order=asc|desc&status=ACTIVE&q=` |
| POST | `/objects/:oid/records` | body `{ recordJson }` |
| GET | `/objects/:oid/records/:rid` | includes `resolved` |
| PATCH | `/objects/:oid/records/:rid` | body `{ recordJson }` (partial merge) |
| POST | `/objects/:oid/records/:rid/archive` | soft delete |
| POST | `/objects/:oid/records/:rid/restore` | |
| GET | `/objects/:oid/records/:rid/related` | reverse lookups: `[{objectId, label, icon, fieldId, count, records:[{recordId, displayName, summary:{...}}]}]` |
| GET | `/objects/:oid/records/:rid/history` | audit entries for this record |
| POST | `/objects/:oid/records/bulk` | `{ action: "UPDATE"\|"ARCHIVE"\|"RESTORE", recordIds:[], patch:{fieldId:value} }` → `{processed, succeeded, failed, errors:[{recordId, message}]}` |
| POST | `/objects/:oid/records/import` | `{ rows:[{...}], mapping:{ "CSV Column": "fieldId" }, dryRun:false }` → same result shape + `preview[]` when `dryRun` |
| GET | `/objects/:oid/records/export` | `?format=csv|json&fieldIds=f1,f2&recordIds=` → csv streams as `text/csv` |

### 5.4 Search / Views
| Method | Path | Notes |
|---|---|---|
| POST | `/search` | body below; served from the index layer, never a collection scan |
| GET | `/search/suggest` | `?objectId=&fieldId=&prefix=` → `[{value, count}]` (TRIE index) |
| GET | `/views` | `?objectId=` saved views for current user |
| POST | `/views` | `{name, objectId, filters, logic, sort, columns, isDefault}` |
| PATCH | `/views/:viewId` / DELETE | |

```jsonc
// POST /search request
{ "objectId": "customer",
  "filters": [ {"fieldId":"f3","operator":"eq","value":"Hyderabad"},
               {"fieldId":"f4","operator":"gt","value":25} ],
  "logic": "AND",
  "sort": { "fieldId": "f1", "order": "asc" },
  "page": 1, "limit": 25,
  "columns": ["f1","f2","f3"] }

// POST /search response
{ "success": true,
  "data": { "records": [ Record... ],
            "plan": { "strategy": "INDEX_INTERSECTION", "tookMs": 7, "scanned": 0,
                      "steps": [ {"fieldId":"f3","index":"HASH","matched":128},
                                 {"fieldId":"f4","index":"BTREE","matched":902},
                                 {"op":"INTERSECT","matched":128} ] } },
  "meta": { "page":1, "limit":25, "total":128, "totalPages":6 } }
```
`plan` powers the "why did this match / how fast" UI. Always return it.

### 5.5 Indexes — Admin + System
| Method | Path | Notes |
|---|---|---|
| GET | `/indexes` | `?objectId=&status=` → `[{indexId, name, objectId, objectLabel, fieldId, fieldLabel, type, status, docCount, sizeBytes, health, lastBuiltAt, buildMs}]` |
| GET | `/indexes/summary` | `{ total, healthy, building, failed, inactive }` |
| POST | `/indexes` | `{objectId, fieldId, type?}` |
| GET | `/indexes/:indexId` | + `{ history:[{at, action, docCount, ms}], performance:{avgQueryMs, hits, misses} }` |
| POST | `/indexes/:indexId/rebuild` | async → returns job |
| DELETE | `/indexes/:indexId` | |
| POST | `/indexes/rebuild-all` | |

### 5.6 Lookups
| Method | Path | Notes |
|---|---|---|
| GET | `/lookups/options` | `?objectId=&q=&limit=20` → `[{recordId, displayName, secondary}]` for pickers |
| GET | `/lookups/graph` | `{ nodes:[{objectId,label,icon}], edges:[{from,to,fieldId,label,type:"MANY_TO_ONE"}] }` |
| GET | `/lookups/stats` | `{ total, resolved, failed, resolutionRate, recentFailures:[{fromObject, field, toObject, reason, at}] }` |

### 5.7 Permissions
| Method | Path | Notes |
|---|---|---|
| GET | `/roles` | `[{roleId, name, description, userCount, isSystem}]` |
| POST/PATCH/DELETE | `/roles(/:roleId)` | |
| GET | `/permissions` | `?roleId=` → `{ roleId, objects: { customer: {read,create,update,delete} }, fields: { customer: { f1: "WRITE" } } }` |
| PUT | `/permissions` | same shape as GET |
| PATCH | `/users/:userId` | `{ roleId }` |

### 5.8 Audit
| Method | Path | Notes |
|---|---|---|
| GET | `/audit` | `?objectId=&recordId=&userId=&action=&from=&to=&page=&limit=` |

Entry: `{auditId, at, userId, userName, action, objectId, objectLabel, recordId, recordDisplayName, summary, changes:[{fieldId, label, from, to}]}`

### 5.9 System Console
| Method | Path | Returns |
|---|---|---|
| GET | `/system/health` | `{status:"Healthy"\|"Degraded", uptimeMs, version, environment, db:{status,latencyMs}, eventBus:{status,queued,throughputPerMin,partitions}, checks:[{name,status,detail}]}` |
| GET | `/system/metrics` | `{ eventsPerMin, jobsRunning, jobsQueued, cacheHitRate, indexHealth:{active,total}, errors15m, storage:{usedBytes,totalBytes,percent}, series:{ cpu:[{t,v}], memory:[{t,v}], disk:[{t,v}] } }` |
| GET | `/system/events` | `?limit=50&type=` → `[{eventId, type, objectLabel, payloadSummary, at, status}]` |
| GET | `/system/jobs` | `[{jobId, name, detail, status, progress, startedAt, finishedAt}]` |
| POST | `/system/jobs/:jobId/run` | re-run |
| GET | `/system/cache` | `{hitRate, size, sizeBytes, cachedObjects, cachedFields, lastRefreshAt, hits, misses, evictions}` |
| POST | `/system/cache/refresh` | warm the metadata cache |
| DELETE | `/system/cache` | invalidate |
| GET | `/system/validation/stats` | `{perMin, successRate, failed, activeRules, topFailures:[{rule,count,percent}]}` |
| GET | `/system/logs` | `?level=&limit=` → `[{logId, at, level, source, message}]` + `GET /system/logs/summary` → `{INFO:120,WARNING:15,ERROR:3,CRITICAL:1}` |
| GET | `/system/alerts` | `[{alertId, severity, title, message, at, acknowledged}]`; `POST /system/alerts/:id/ack` |
| GET | `/system/storage` | `{database:{status,name,usedBytes,totalBytes,percent}, collections:[{name,docs,sizeBytes}]}` |
| GET/PATCH | `/system/settings` | `{environment, version, uptime, indexingMode:"SYNC"\|"ASYNC", cacheTtlSeconds, auditRetentionDays, maxBulkSize, featureFlags:{...}}` |
| GET | `/system/overview` | `{objects, fields, records, indexes}` — the 4 KPI tiles on the Admin header too |

## 6. Screens the Frontend Must Deliver

Reference mockups (read them, match the layout, spacing and colour language):
`CRM/platform_admin_screens.png`, `CRM/business_screens.png`, `CRM/system_screens.png`, `CRM/main_flow.png`.

Product name **MetaForce**. Route prefixes: `/admin/*`, `/business/*`, `/system/*`, `/` = user switcher.

**Platform Admin** (indigo/violet accent `#6366F1`, dark navy sidebar):
1. Admin Dashboard (4 KPI tiles: Objects / Fields / Records / Indexes + recent activity)
2. Objects list (search, status pills, pagination, row actions menu)
3. Create Object — 3-step wizard (Basic Information → Object Settings → Review & Publish)
4. Edit Object — tabs: Details · Fields · Settings · Permissions · History
5. Object Lifecycle — Draft → Published → Archived stepper + Archive/Clone actions
6. Fields list (per object; label, api name, type, required, searchable, row actions)
7. Add Field — 4-step wizard (Field Information → Field Settings → Validation → Review)
8. Edit Field — tabs: Details · Validation · Advanced · History
9. Field Properties & Validation (toggle rows: Required / Format / Unique / Custom Regex)
10. Reorder Fields (drag & drop, Reset / Save Order)
11. Lookup Field builder (related object + display field + required/searchable)
12. Index Management (table + Build Index + status counters)
13. Index Details / Status — tabs Overview · Performance · History, health bar, Rebuild/Delete
14. Search & Filter Records (filter chips, results table)
15. View Record (Overview · Related · History)
16. Bulk Operations — 3-step (Select Records → Choose Action → Review & Confirm)
17. Audit Log / History (filters: object, action, date range)
18. Users & Roles + Permission matrix
19. Settings

**Business User** (emerald accent `#10B981`):
1. Dashboard (My Objects / Total Records / Recent Views / Favorites tiles, Recently Opened, My Favorites)
2. My Objects
3. View Records (list, filters, sort, pagination, New Record)
4. View Record detail (Overview · Related Records · History + Actions rail + Quick Links)
5. Create Record (dynamic form from metadata)
6. Edit Record
7. Search & Filter (filter builder rows: field / operator / value, Add Filter, Clear All, Save View)
8. Sort & View Options (list/grid/board toggle, column chooser, sort by/direction)
9. Bulk Actions
10. Import Records (drag & drop CSV, column→field mapping, sample download)
11. Export Records (format, columns, "export filtered only")
12. My Views (saved views)
13. Related Records (tabs per child object)
14. Reports (list + simple aggregations rendered as charts)
15. Activity / Audit Trail
16. Archive (soft delete) confirmation

**System Console** (dark sidebar, single-scroll operations dashboard + section pages):
System Dashboard (7 KPI tiles) · Index Management · Event Monitor · Background Jobs ·
Lookup Resolver · Validation Engine · Metadata Cache · Data Overview · Audit Logs ·
System Logs · Alerts & Notifications · Metrics (charts) · System Settings · Integrations · Security.

## 7. Design Discipline (both agents)

SOLID is the acceptance bar, not decoration:
- **S** — one reason to change per module/class/component.
- **O** — a new field type, validator, index type, or filter operator must be addable by
  *adding a file and registering it*, never by editing a `switch` in the engine.
- **L** — all validators share one interface; all index strategies share one interface.
- **I** — small interfaces (`IRepository`, `IValidator`, `IIndexStrategy`, `ICache`).
- **D** — services receive dependencies via constructor injection; no service `import`s a
  concrete Mongoose model directly (repositories only).

Required patterns — Backend: Repository, Factory (field types, validators, index strategies),
Strategy (validation, index, operators), Builder (record + query), Observer (in-process event bus),
Composite/Interpreter (filter expression tree), Singleton (metadata cache), State (object lifecycle).
Frontend: Factory (field renderer), Strategy (per-type input/display components), Builder (query),
Provider (auth/user, metadata, toast), Custom hooks (data access), Repository (api services),
Composition (layouts).

Keep it readable. No dependency-injection frameworks, no code generation, no abstraction that
isn't used twice. Every module gets a short `README.md` naming its responsibility and patterns.
