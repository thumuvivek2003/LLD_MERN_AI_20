# MetaForce — Frontend

React UI for the metadata-driven CRM platform. Three consoles (Platform Admin, Business User,
System) over one metadata engine. Every form, table, filter and column in the app is generated
from `ObjectDefinition.fields[]` returned by the API — no screen hardcodes a business field.

Stack: React 18 · Vite 5 · Tailwind 3 · react-router-dom 6 · axios · lucide-react · recharts.
ES modules throughout. The API contract is `../CONTRACT.md` — it is the source of truth for
every endpoint, enum and payload shape used here.

---

## Run

```bash
npm install
npm run dev        # http://localhost:5173  (proxies /api → http://localhost:4000)
npm run build      # production build into dist/
npm run preview    # serve the built bundle
```

The backend must be running first (`../Backend`: `npm run seed && npm start`).
There is no login: the landing page is a **user switcher**. Picking a persona stores
`metaforce.userId` in `localStorage`; an axios interceptor sends it as `x-user-id` on
every request, and the backend resolves role + permissions from it.

| Persona | Role | Lands on |
|---|---|---|
| Admin User | `PLATFORM_ADMIN` | `/admin` |
| Sales Manager · HR Manager · Employee | `BUSINESS_USER` | `/business` |
| System Daemon | `SYSTEM` | `/system` |

---

## Screen map

### Platform Admin — `/admin/*` (indigo accent, dark navy sidebar)

| Route | Screen |
|---|---|
| `/admin` | Dashboard — Objects / Fields / Records / Indexes KPIs, activity feed, object health |
| `/admin/objects` | Objects list — search, status filter, sort, pagination, row actions |
| `/admin/objects/new` | Create Object — 3-step wizard (Basic Information → Object Settings → Review & Publish) |
| `/admin/objects/:oid` | Edit Object — tabs: Details · Fields · Settings · Permissions · History |
| `/admin/objects/:oid/lifecycle` | Draft → Published → Archived stepper, Publish / Archive / Restore / Clone |
| `/admin/objects/:oid/fields` | Fields of one object — add, edit, delete, reorder entry points |
| `/admin/objects/:oid/fields/new` | Add Field — 4-step wizard (Information → Settings → Validation → Review) |
| `/admin/objects/:oid/fields/:fid` | Edit Field — tabs: Details · Validation · Advanced · History (lookup builder lives here) |
| `/admin/objects/:oid/fields/reorder` | Drag-and-drop reorder with Reset / Save Order |
| `/admin/fields` | Field browser across every object |
| `/admin/relationships` | Lookup graph — forward references and reverse relationships |
| `/admin/validation-rules` | Validation rules across the platform |
| `/admin/indexes` | Index Management — table, health counters, Build Index |
| `/admin/indexes/:indexId` | Index Details — tabs: Overview · Performance · History, Rebuild / Delete |
| `/admin/records` · `/admin/records/:oid` | Record browser and list |
| `/admin/records/:oid/:rid` | Record view (admin side) |
| `/admin/records/:oid/bulk` | Bulk Operations — 3-step (Select Records → Choose Action → Review & Confirm) |
| `/admin/search` | Search & Filter with the index query plan shown |
| `/admin/users` | Users & Roles + permission matrix (object CRUD and field-level access) |
| `/admin/audit` | Audit Log — filters by object, action and date range |
| `/admin/settings` | Platform settings |

### Business User — `/business/*` (emerald accent)

| Route | Screen |
|---|---|
| `/business` | Dashboard — My Objects / Total Records / Saved Views / Favorites, Recently Opened, My Favorites |
| `/business/objects` | My Objects — everything the role can reach |
| `/business/favorites` · `/business/recent` | Starred objects · recently opened |
| `/business/objects/:oid/records` | Record list — filters, sort, column chooser, list/grid/board toggle, pagination |
| `/business/objects/:oid/records/new` · `/:rid/edit` | Create / Edit record (form generated from metadata) |
| `/business/objects/:oid/records/:rid` | Record detail — Overview · Related Records · History, actions rail, quick links |
| `/business/objects/:oid/bulk` | Bulk update / archive with per-row results |
| `/business/objects/:oid/import` | Import — drag-and-drop CSV, column→field mapping, dry-run preview |
| `/business/objects/:oid/export` | Export — format, column selection, "filtered only" |
| `/business/search` | Filter builder (field → operator → value), Save View, result plan |
| `/business/views` | Saved views |
| `/business/reports` | Reports with charts over aggregated records |
| `/business/activity` | Activity / audit trail |
| `/business/help` · `/business/settings` | Help · preferences |

Archiving (soft delete) is a confirm dialog on the record detail page, per the mockups.

### System Console — `/system/*` (dark sidebar, operations view)

`/system` dashboard (7 KPI tiles + Index / Events / Jobs / Cache / Lookup / Validation panels),
then one page each: `indexes`, `events`, `jobs`, `lookups`, `validation`, `cache`, `data`,
`audit`, `logs`, `alerts`, `metrics`, `settings`, `integrations`, `security`.

---

## Structure

```
src/
  app/            router.jsx (all routes + role guards), providers.jsx
  core/
    api/          axios.client.js (x-user-id interceptor, envelope unwrap, typed errors)
                  api.endpoints.js + one <domain>.api.js per backend module
    context/      UserContext (persona), MetadataContext (object/field cache), ToastContext
    hooks/        useObjects useObject useFields useRecords useRecord useSearch
                  usePermission usePagination useDebounce useAsync
    fields/       the field-type registry — see core/fields/README.md
    components/   ui/ table/ form/ charts/ layout/ record/
    layouts/      AdminLayout BusinessLayout SystemLayout
    guards/       RoleRoute
    utils/        queryBuilder.js formatters.js permission.js csv.js icons.js cx.js
  modules/        switcher/ admin/ business/ system/   (one folder per business capability)
  shared/         enums/ dto/ mapper/   — enums mirror CONTRACT §3 exactly
  styles/         index.css (Tailwind layers + design tokens: .mf-input, .mf-label, .mf-link)
```

Layering rule: **pages orchestrate, hooks fetch, api services talk HTTP, components render.**
No page calls axios directly and no component builds a URL.

## Patterns

| Pattern | Where | Why |
|---|---|---|
| Factory | `core/fields/registry.js` | `FIELD_TYPE` → strategy. Adding a type = one file + one registry entry |
| Strategy | `core/fields/types/*.field.jsx` | Each type owns its `Input` / `Display` / `FilterWidget` / operators / coercion |
| Builder | `core/utils/queryBuilder.js` | Composes the `POST /search` body; saved views round-trip through it |
| Provider | `core/context/*` | Persona, metadata cache and toasts as composed providers |
| Repository | `core/api/*.api.js` | The only place HTTP lives; swapping transport touches nothing else |
| Custom hooks | `core/hooks/*` | Data access + async state, reused across every console |
| Composition | `core/layouts/*` | Three consoles compose the same `Sidebar`/`TopBar` primitives |

There is deliberately **no `switch (field.type)` anywhere in the app** — `FieldRenderer`
resolves the strategy from the registry. That is the whole point of the metadata design.

## SOLID notes

- **S** — a page composes; `useRecords` fetches; `records.api.js` does HTTP; `DataTable` renders.
- **O** — new field type, operator or validator = a new file plus a registry entry.
- **L** — every field strategy satisfies the same shape, so `FieldRenderer` never special-cases one.
- **I** — a strategy exposes only the faces a caller needs (`Input`, `Display`, `FilterWidget`).
- **D** — components depend on hooks and the registry, never on axios or an endpoint string.

## Accessibility

`FieldRenderer` generates one `id`/`htmlFor` pair per rendered field, so every dynamic form
control is programmatically labelled; custom widgets (toggle, lookup picker, chip picker) get
`aria-labelledby` and a `role` instead, since they are not labelable elements. Hand-built
forms in the admin and system consoles carry explicit `htmlFor`/`id` pairs for the same reason.

## Notes

- Favorites and "recently opened" are per-user `localStorage` preferences (the contract exposes
  no endpoint for them) and are read through try/catch so a blocked-storage browser still renders.
  They populate as you use the app; they are never stand-in data for a missing API.
- The production bundle is a single ~1.7 MB chunk (recharts dominates). Route-level
  `React.lazy` splitting is the obvious next step if that matters.
