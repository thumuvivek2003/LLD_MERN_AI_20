# Admin module — the Platform Admin console

Owns platform **metadata**: what objects exist, what fields they have, how those fields are
validated and indexed, who may see them, and what changed.

```
object/      objects list, 3-step create wizard, edit tabs, lifecycle (Draft→Published→Archived)
field/       field list/browser, 4-step add wizard, edit tabs, reorder, validation rules
index/       index management table, build dialog, per-index detail (overview/performance/history)
permission/  users, roles and the object × field permission matrix
record/      admin-side record browsing, search and bulk operations
audit/       audit log with object / action / date filters
settings/    platform settings
components/  wizard shell and the step components shared by the object and field wizards
```

An admin never edits record data as part of this console's purpose — they shape the schema
that the Business console then renders. Operations that are one action rather than a
destination (publish, archive, clone, rebuild) are buttons inside a page, not routes.
