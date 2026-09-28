# Business module — the Business User console

Owns **records**. This console never edits metadata; it consumes it. Every form, column,
filter and sort option on these screens is generated from the object's field metadata, so a
field added by an admin appears here with no code change.

```
dashboard/  KPIs, recently opened, favorites
objects/    the objects this role can reach, plus favorites and recents
record/     list, detail (Overview · Related · History), create, edit, bulk, import, export
search/     the filter builder — field → operator → value rows, backed by SearchQueryBuilder
views/      saved views (a saved filter set + columns + sort)
reports/    aggregations over records, rendered with recharts
activity/   audit trail for the records this user can see
```

Deletion is soft: records are **archived** and can be restored, matching the backend's
record lifecycle. Favorites and recents are per-user `localStorage` preferences.
