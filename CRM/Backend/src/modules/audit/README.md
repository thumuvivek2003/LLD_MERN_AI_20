# Audit Module

## Responsibility
Who changed what, when, and from what value to what value.

## Public API
| Export | Purpose |
|---|---|
| `AuditService.write({action, objectId, recordId, userId, before, after, ...})` | called **only** by the audit subscriber |
| `AuditService.query(filters)` | `GET /audit` |
| `AuditService.recent(limit)` | dashboard activity feed |
| `AuditService.purgeOlderThan(days)` | the Audit Archive scheduled job |

## Patterns
| Pattern | Where | Why |
|---|---|---|
| **Observer (subscriber)** | `core/event-bus/subscribers/audit.subscriber.js` | No business service writes audit rows. The subscriber is a 15-row mapping table from event type → `AUDIT_ACTION` + summary. Adding an audited event is one line; switching audit off is deleting one `register…` call. |
| **Diff** | `core/utils/diff.util.js` | `diffRecordJson(before, after, fields)` produces `changes:[{fieldId, label, from, to}]`, resolving the human label from field metadata so history reads *"City: Pune → Hyderabad"* rather than *"f4 changed"*. |

## Entry shape (CONTRACT.md §5.8)
```jsonc
{ "auditId", "at", "userId", "userName", "action", "objectId", "objectLabel",
  "recordId", "recordDisplayName", "summary",
  "changes": [ { "fieldId": "f4", "label": "City", "from": "Pune", "to": "Hyderabad" } ] }
```

`GET /objects/:oid/records/:rid/history` is the same store filtered by `recordId`.

## Note
User names are resolved once and memoised — an audit list of 25 rows costs zero
extra user lookups after the first of each user.
