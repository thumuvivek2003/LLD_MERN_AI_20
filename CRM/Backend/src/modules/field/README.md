# Field Module

## Responsibility
Everything type-specific about a field, and the field list of one object.

It does **not** build indexes. Marking a field searchable publishes
`field.searchable.enabled`; a subscriber builds the index. That is chat.md's
"make it automatic — that's event-driven design" recommendation, and it is why
`FieldService` has no reference to `IndexManager`.

## Public API
| Export | Purpose |
|---|---|
| `fieldTypeRegistry.get(type) / catalogue() / indexTypeFor(type)` | the 13 type descriptors |
| `FieldFactory.create(input, {fieldId, order})` | raw payload → Field document |
| `FieldFactory.applyPatch(field, patch)` | mutable props, with `indexed` re-derived |
| `FieldService.list / add / patch / remove / reorder` | the `/objects/:oid/fields` surface |
| `FieldService.catalogue()` | `GET /field-types` |

## Patterns
| Pattern | Where | Why |
|---|---|---|
| **Factory (per type)** | `types/*.type.js` | Each FIELD_TYPE is a `FieldTypeDescriptor` subclass owning coercion, index type, index-key derivation, sort value and display formatting. Nothing else in the platform switches on `field.type`. |
| **Registry** | `types/field-type.registry.js` | One array. `GET /field-types` is generated from it — the Add-Field wizard is driven by the same objects the engine uses. |
| **Factory (assembly)** | `field.factory.js` | Applies type-aware defaults (`unique` is silently dropped for types that can't support it) and derives `indexed = searchable \|\| sortable \|\| filterable` so the client can never set it directly. |
| **Inheritance for reuse** | `currency ⊂ number`, `datetime ⊂ date`, `multi-picklist ⊂ picklist` | Genuine LSP relationships — Currency is Number storage plus money formatting. |

## What a descriptor owns
```js
coerce(raw)      → {ok, value} | {ok:false, message}   // "25" → 25, bad input → typed error
indexType                                              // TRIE | BTREE | HASH
indexKeys(value) → string[]                            // MULTI_PICKLIST emits several
sortValue(value)                                       // comparable primitive for BTREE
display(value)                                         // "₹2,85,000"
supports                                               // drives the Add-Field wizard
```

## Index type by field type (CONTRACT.md §3)
`TEXT/TEXTAREA → TRIE` · `NUMBER/CURRENCY/DATE/DATETIME → BTREE` · everything else `→ HASH`.
This mapping lives in the descriptors, not in a table the engine reads.

## Guards
- Type change is rejected (409) once records exist.
- Deleting the primary display field, or a field another object's lookup uses as
  its `displayFieldId`, is rejected (409).
- Lookup fields go through `LookupGuard` for target validity and cycle detection.
