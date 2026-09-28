# Permission Module

## Responsibility
Role → object CRUD and role → field access. Role and matrix administration.

## Public API
| Export | Purpose |
|---|---|
| `PermissionService.can(roleId, objectId, action)` | object-level check |
| `PermissionService.fieldAccess(roleId, objectDef)` | `{f1:'WRITE', f5:'HIDDEN'}` |
| `PermissionService.fullMatrix / replaceMatrix` | `GET/PUT /permissions` |
| `PermissionService.listRoles / createRole / updateRole / deleteRole` | `/roles` |
| `requirePermission(action, objectIdFrom)` | route middleware |
| `requireMetadataAdmin(action)` | guards the metadata-authoring surface |
| `FieldAccessMapper.maskRecordJson / maskFields / assertWritable` | field-level enforcement |

## Patterns
| Pattern | Where | Why |
|---|---|---|
| **Middleware guard** | `permission.middleware.js` | Object-level checks can reject before any work happens, so they belong in the pipeline, not in services. `objectIdFrom` is a resolver because the objectId lives in `params.oid` on record routes, in the body on `/search`, and in the query string on `/lookups/options`. |
| **Mapper** | `field-access.mapper.js` | Field-level checks need the field list *and* the payload, so they cannot be middleware. Applied by the record mapper outbound and the record service inbound. |
| **Data-driven authority** | seeded matrices | See below. |

## No role-name checks anywhere
There is no `if (role === 'ADMIN')` in this codebase. An admin is powerful
because their stored matrix contains:

```jsonc
{ "objects": { "*": { "read": true, "create": true, "update": true, "delete": true } },
  "fields":  { "*": { "*": "WRITE" } } }
```

Resolution order is specific-then-wildcard:
`objects[objectId]` → `objects["*"]` → deny.
`fields[objectId][fieldId]` → `fields[objectId]["*"]` → `fields["*"]["*"]` → `WRITE`.

Consequences that matter: a new role with the same matrix behaves identically to
the admin, revoking admin rights is a data change, and a newly created object is
covered by every role's `"*"` fallback without a migration.

## Enforcement points
| Level | Where | Failure |
|---|---|---|
| Object CRUD | route middleware | 403 `PERMISSION_DENIED` |
| Field read | `RecordMapper` via `maskRecordJson` | field silently absent |
| Field write | `RecordService` via `assertWritable` | 403 listing the denied field labels |
| Filtering on a hidden field | `SearchService` | 404 (does not confirm the field exists) |

The matrix is cached per role in memory and invalidated on `PUT /permissions`,
role deletion, and `object.created`.
