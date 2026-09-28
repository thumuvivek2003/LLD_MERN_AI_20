# System module — the System Console

The background actor made visible. Nothing here is a CRUD screen; every page reports what
the platform is doing to itself, reading the `/api/system/*`, `/api/indexes` and
`/api/lookups` telemetry endpoints.

```
dashboard/   7 KPI tiles + panels for indexes, events, jobs, cache, lookups, validation
pages/       one page per concern:
             IndexMonitor · EventMonitor · BackgroundJobs · LookupResolver · ValidationEngine
             MetadataCache · DataOverview · SystemAudit · SystemLogs · Alerts · Metrics
             SystemSettings · Integrations · Security
components/  the shared panels (KPI row, stat grid, event stream, job list, failure bars,
             log-level donuts, index summary table)
```

The figures are real: cache hit rate comes from actual hits/misses, event throughput from the
in-process event bus, storage from MongoDB `dbStats`, and job progress from the scheduler's
job registry. If a number cannot be measured it is not invented.
