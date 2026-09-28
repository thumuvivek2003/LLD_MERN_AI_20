# System Module

## Responsibility
The System (background) actor from `main_flow.png`: health, metrics, jobs,
storage, settings, logs, alerts, and the KPI tiles.

**Design rule: report what is measurable, and mark what is not.** Almost every
number here is probed at request time or accumulated from real activity.

## Public API
| Export | Endpoint |
|---|---|
| `HealthService.check()` | `GET /system/health` |
| `MetricsService.snapshot() / storage()` | `GET /system/metrics` |
| `SystemService.overview / storage / settings / patchSettings / alerts` | `/system/overview`, `/storage`, `/settings`, `/alerts` |
| `JobRegistry.list / run / runDetached / schedule` | `/system/jobs`, `POST /system/jobs/:jobId/run` |
| `SchedulerService.registerAll()` | registers the four periodic jobs at boot |
| `LogService.list / summary / errorsSince` | `/system/logs`, `/system/logs/summary` |

## Where each number comes from
| Field | Source |
|---|---|
| `uptimeMs` | module-load timestamp |
| `db.latencyMs` | live `admin().ping()`, hrtime-measured |
| `eventBus.throughputPerMin` | rolling 60s window of real publish timestamps |
| `cacheHitRate`, `hits`, `misses`, `evictions` | `MetadataCache` counters |
| `indexHealth`, index `docCount` / `sizeBytes` / `buildMs` | `indexdefinitions`, written by real builds |
| index `health` % | measured drift: `docCount` vs live active record count |
| `errors15m` | timestamps of real ERROR/CRITICAL log lines |
| `series.cpu` | `process.cpuUsage()` deltas, sampled every 15s |
| `series.memory` | `process.memoryUsage().rss` / `os.totalmem()` |
| `storage.usedBytes`, `collections[]` | Mongo `dbStats` + `$collStats` |
| jobs `status` / `progress` / `startedAt` | written by the runner as work happens |
| logs | the shared logger's sink — every `logger.*()` call in the process |
| **`storage.totalBytes`** | **derived**: a single-node Mongo exposes no volume size, so a 1 GiB nominal quota gives the gauge a denominator |
| **`eventBus.partitions`** | **constant 1** — the in-process bus has no partitions |

Those last two are the only invented values, and both are noted in code.

## Patterns
| Pattern | Where | Why |
|---|---|---|
| **Registry** | `job.registry.js` | Scheduled and ad-hoc jobs share one store, so `POST /indexes/:id/rebuild` shows up in `/system/jobs` alongside the cron jobs. |
| **Scheduler** | `scheduler.service.js` | Four real jobs: index optimization (rebuilds indexes with >5% drift), audit archive (honours `auditRetentionDays`), orphan cleanup (drops indexes whose field is gone), cache refresh. |
| **Sink / Observer** | `log.service.js` | Registers itself on the shared logger, so `/system/logs` shows genuine application output. INFO stays in the ring buffer only (a request log would otherwise write a document per HTTP call); WARNING and above are persisted. |
| **Repository** | `system.repository.js` | `DatabaseStatsRepository` wraps Mongo's admin commands so the service never touches the driver. |
