# Lookup Module

## Responsibility
Everything relational in a schema-less store: validating references, resolving
them for display, computing the reverse side, preventing cycles, and applying
`onDelete` rules.

## Public API
| Export | Purpose |
|---|---|
| `LookupResolver.resolveMany(objectDef, records)` | forward resolution → the `resolved` map in CONTRACT.md §4 |
| `LookupRelationshipService.relatedFor(objectId, recordId)` | `GET /records/:rid/related` |
| `LookupGuard.assertValidTarget` / `assertNoCycle` / `assertNotUsedAsDisplayField` | metadata-time guards |
| `LookupCascadeService.apply(objectDef, record, actor)` | RESTRICT / CASCADE / SET_NULL on archive |
| `LookupService.options` / `graph` / `stats` | `/lookups/*` |

## Patterns
| Pattern | Where | Why |
|---|---|---|
| **Graph traversal** | `lookup.guard.js#assertNoCycle` | Depth-first walk of the lookup edges before an edge is added. A cycle would make forward resolution and CASCADE non-terminating. |
| **Strategy (data-driven)** | `lookup.cascade.service.js` | The `onDelete` rule is read from field metadata, so changing Invoice→Customer from RESTRICT to SET_NULL is a metadata edit, not a code change. |
| **Batch resolution** | `lookup.resolver.js` | One query per distinct target object per page, not one per row × field. |

## Forward vs reverse
```
Sales Order.f5 = "rec_CUST_101"        ← forward: stored, one field
Customer rec_CUST_101 → its orders     ← reverse: computed, stored nowhere
```
Nothing is written on the parent when a child is created. `relatedFor` answers
the reverse question with `countByFieldValue` + a small preview page, which is
why adding a child costs exactly one write.

## Two levels of integrity
| Level | Where | Rule |
|---|---|---|
| Metadata | `LookupGuard` | target exists, target is not archived, display field exists, no cycle, target published |
| Record | `validators/lookup-exists.validator.js` | referenced record exists, is ACTIVE, and its object is PUBLISHED |

They are separate because they fire at different times and produce different
errors (409 vs 422).
