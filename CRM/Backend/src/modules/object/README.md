# Object Module

## Responsibility
The aggregate root of the metadata model: an object's identity, its embedded
field list, its lifecycle state, and its version history.

## Public API
| Export | Purpose |
|---|---|
| `ObjectService.list / get / stats / versions` | reads |
| `ObjectService.create / patch / transition / clone / remove` | writes |
| `ObjectService.referencedBy(objectId)` | inbound lookup edges (used by delete guard + UI) |
| `ObjectVersionService.recordChange(before, after)` | bumps `version`, stores the diff |
| `objectStateFactory.for(objectDef)` | the State object for a status |
| `ObjectMapper.toListItem / toDetail` | contract shapes |

## Patterns
| Pattern | Where | Why |
|---|---|---|
| **State** | `states/{draft,published,archived}.state.js` | Every "you can't do X in status Y" rule lives in one class. `PublishedState.canCreateRecords() === true` is the single reason records reject a DRAFT object — the record service just asks. |
| **Factory** | `states/object-state.factory.js` | Status string → State instance. States are stateless, so one shared instance each. |
| **Repository** | `object.repository.js` | Includes `updateField()` because a positional embedded-array update needs `arrayFilters`, which does not belong in a service. |
| **Mapper** | `object.mapper.js` | List rows omit `fields[]` per CONTRACT.md §5.1; detail rows include them plus the `lifecycle` descriptor. |

## The state machine
```
        publish                 archive
DRAFT ───────────► PUBLISHED ───────────► ARCHIVED
  │                    ▲                     │
  │ archive            └─────────────────────┘
  └──────────────────────────► ARCHIVED     restore
```
| | DRAFT | PUBLISHED | ARCHIVED |
|---|---|---|---|
| create records | ✗ | ✓ | ✗ |
| edit records | ✗ | ✓ | ✗ |
| edit schema | ✓ | ✓ | ✗ |
| change field type | ✓ | ✓ (only with 0 records) | ✗ |
| delete | ✓ | ✓ (no records, no inbound lookups) | ✓ |

## Versioning
Any schema change calls `ObjectVersionService.recordChange`, which diffs the
before/after definitions, increments `version`, and appends an `objectversions`
row. Records store the `objectVersion` they were written against, so an old
record still tells you which shape produced it — chat.md's "Customer v1 → v2 → v3".

## Delete rules
`DELETE /objects/:oid` is a hard delete and refuses (409) if the object still has
records or if any other object's lookup field points at it. Archiving is the
soft path and always available.
