# Validation Module

## Responsibility
Decide whether a candidate `recordJson` may be persisted, and produce the
`VALIDATION_ERROR.details[]` array exactly as CONTRACT.md §1 specifies:
`{ fieldId, apiName, rule, message }`.

It owns **when** validation runs and how failures aggregate. It owns **nothing**
about how any individual rule is checked.

## Public API
| Export | Purpose |
|---|---|
| `ValidationService.validateRecord({objectDef, recordJson, recordId, isCreate, touched, batchSeen})` | returns `[]` when valid, otherwise the details array |
| `ValidationService.getStats()` | powers `GET /system/validation/stats` |
| `ValidationFactory.forField(field)` / `forObject(objectDef)` | resolves the applicable strategies |
| `validatorRegistry` | the rule → strategy table |

## Patterns
| Pattern | Where | Why |
|---|---|---|
| **Strategy** | `validators/*.validator.js` | Every rule is an interchangeable `IValidator`. The engine calls `validate(ctx)` and knows nothing else. |
| **Factory** | `validation.factory.js` | Selects strategies by asking `appliesTo(field)` rather than switching on field type — so field metadata, not code, decides which rules run. |
| **Registry** | `validator.registry.js` | One array. Adding `phone-format` means adding a file and a line; no existing file is edited (OCP). |

## Rules shipped
`READ_ONLY`, `REQUIRED`, `LENGTH`, `NUMBER_RANGE`, `EMAIL_FORMAT`, `DATE_FORMAT`,
`PICKLIST`, `REGEX`, `LOOKUP_EXISTS`, `UNIQUE`.

Order in the registry is deliberate: cheap structural checks run before the two
rules that need a database round-trip (`LOOKUP_EXISTS`, `UNIQUE`), and only the
first failure per field is reported so a form shows one message per input.

## Notes
- `batchSeen` exists because rows inside a single import are not yet persisted —
  intra-batch duplicates can only be caught in memory.
- The service publishes `validation.failed` rather than writing to any log or
  audit store itself; subscribers decide what to do with it.
