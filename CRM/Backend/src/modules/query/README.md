# Query Module

## Responsibility
Turn the contract's `filters[]` into an executable plan and run it against the
index layer. Owns *how a search is answered*; owns nothing about *what an index
is* (that's `modules/index`) or *how results are shaped* (that's `modules/search`).

```
filters[] ──► QueryParser ──► expression tree ──► QueryOptimizer ──► QueryExecutor ──► {records, total, plan}
                                                                            │
                                                                     IndexManager
```

## Public API
| Export | Purpose |
|---|---|
| `QueryBuilder.for(objectId).where(...).sortBy(...).paginate(...).build()` | normalised spec |
| `QueryParser.parse(spec, objectDef)` | spec → expression tree |
| `QueryOptimizer.optimize(tree, ctx)` | annotate + reorder |
| `QueryExecutor.execute(objectDef, spec)` | `{records, total, plan}` |
| `operatorRegistry` | the 13 OPERATOR strategies |

## Patterns
| Pattern | Where | Why |
|---|---|---|
| **Composite** | `nodes/{and,or,comparison}.node.js` | `AndNode`/`OrNode` hold children; `ComparisonNode` is the leaf. Uniform `execute(ctx)` means nesting comes free — the parser already accepts grouped filters even though today's UI sends a flat list. |
| **Interpreter** | `ExpressionNode.execute(ctx)` | Each node interprets itself against the index layer instead of being compiled to a query string. |
| **Strategy** | `operators/operator.registry.js` | One entry per operator, each with an `evaluate` used for the in-memory residual path. |
| **Builder** | `query.builder.js` | Three callers (search endpoint, record list, saved views) assemble the same spec without duplicating literals. |

## The nullable-Set contract
`execute(ctx)` returns either a `Set<recordId>` or `null`.
`null` means *"this branch could not be index-served; I have registered a
residual predicate instead"*. That one convention lets an unindexed predicate sit
inside a tree next to indexed ones without any node knowing about the others,
and it's why `AndNode` can simply skip nulls while `OrNode` must reject the whole
disjunction if any branch is null (an OR with one unknown branch cannot be
narrowed without dropping matches).

## Optimizer rule
Sort every AND's children by estimated result size, most selective first,
`Infinity` for unindexed. Intersecting a 40-row set into a 900-row set costs 40
probes; the other order costs 900. Unindexed predicates land last, so they filter
an already-narrow candidate set rather than the whole object.

Selectivity comes from real index statistics — `IIndexStrategy.cardinality()`
(distinct key count) combined with a per-operator factor.

## Plan strategies reported
| strategy | meaning |
|---|---|
| `INDEX_INTERSECTION` | 2+ indexed predicates intersected |
| `INDEX_SCAN` | exactly one indexed predicate |
| `HYBRID` | indexed predicates narrowed the set, then a residual filter refined it |
| `FULL_SCAN` | no predicate was index-servable |
| `INDEX_ORDER_SCAN` | no filters, ordering pushed down into a BTREE |
| `PAGED_SCAN` | no filters, paged read straight from the record store |

`scanned` counts records actually read for residual filtering or sorting — it is
`0` on a pure index path.
