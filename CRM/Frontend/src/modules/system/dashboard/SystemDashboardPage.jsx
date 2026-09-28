import { Link } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  BriefcaseBusiness,
  Database,
  FileClock,
  HardDrive,
  Layers,
  Link2,
  RefreshCw,
  ScrollText,
  Settings,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import useAsync from '../../../core/hooks/useAsync.js';
import systemApi from '../../../core/api/system.api.js';
import indexesApi from '../../../core/api/indexes.api.js';
import lookupsApi from '../../../core/api/lookups.api.js';
import auditApi from '../../../core/api/audit.api.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card, CardHeader, CardLinkFooter } from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import Badge from '../../../core/components/ui/Badge.jsx';
import StatusPill from '../../../core/components/ui/StatusPill.jsx';
import { DonutChart, LineChart, ProgressBar } from '../../../core/components/charts/index.js';
import AuditTable from '../../../core/components/table/AuditTable.jsx';
import { formatBytes, formatCompact, formatDateTime, formatPercent } from '../../../core/utils/formatters.js';
import SystemKpiRow from '../components/SystemKpiRow.jsx';
import EventStream from '../components/EventStream.jsx';
import JobList from '../components/JobList.jsx';
import StatGrid from '../components/StatGrid.jsx';
import IndexSummaryTable, { IndexStatusCounters } from '../components/IndexSummaryTable.jsx';
import FailureBars from '../components/FailureBars.jsx';
import LogLevelDonuts from '../components/LogLevelDonuts.jsx';

/** System console home — every operational surface on one scrolling page. */
export function SystemDashboardPage() {
  const toast = useToast();
  const health = useAsync(() => systemApi.health(), []);
  const metrics = useAsync(() => systemApi.metrics(), []);
  const indexes = useAsync(() => indexesApi.list({ limit: 6 }), [], { initialData: [] });
  const indexSummary = useAsync(() => indexesApi.summary(), []);
  const events = useAsync(() => systemApi.events({ limit: 7 }), [], { initialData: [] });
  const jobs = useAsync(() => systemApi.jobs(), [], { initialData: [] });
  const cache = useAsync(() => systemApi.cache(), []);
  const lookups = useAsync(() => lookupsApi.stats(), []);
  const validation = useAsync(() => systemApi.validationStats(), []);
  const audit = useAsync(() => auditApi.list({ limit: 5 }), [], { initialData: [] });
  const logs = useAsync(() => systemApi.logsSummary(), []);
  const storage = useAsync(() => systemApi.storage(), []);
  const alerts = useAsync(() => systemApi.alerts(), [], { initialData: [] });
  const settings = useAsync(() => systemApi.settings(), []);

  const refreshAll = () => {
    [health, metrics, indexes, indexSummary, events, jobs, cache, lookups, validation, audit, logs, storage, alerts]
      .forEach((resource) => resource.reload().catch(() => {}));
    toast.info('Refreshing', 'Pulling the latest system state');
  };

  const rebuildAll = async () => {
    try {
      await indexesApi.rebuildAll();
      await Promise.all([indexes.reload(), indexSummary.reload(), jobs.reload()]);
      toast.success('Rebuild queued for all indexes');
    } catch (err) {
      toast.fromError(err, 'Rebuild failed');
    }
  };

  const series = metrics.data?.series || {};
  const chartData = (series.cpu || []).map((point, index) => ({
    t: new Date(point.t).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    cpu: point.v,
    memory: series.memory?.[index]?.v ?? 0,
    disk: series.disk?.[index]?.v ?? 0,
  }));

  const unacked = (Array.isArray(alerts.data) ? alerts.data : []).filter((a) => !a.acknowledged);

  return (
    <>
      <PageHeader
        title="System Dashboard"
        subtitle="Background operations & system health"
        icon={Activity}
        actions={
          <Button variant="secondary" icon={RefreshCw} onClick={refreshAll}>
            Refresh
          </Button>
        }
      />

      <SystemKpiRow
        health={health.data}
        metrics={metrics.data}
        loading={health.loading || metrics.loading}
      />

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <CardHeader
            title="Index Management"
            subtitle="Monitor and manage all search indexes"
            icon={Database}
            actions={
              <>
                <Button variant="secondary" size="sm" onClick={rebuildAll}>
                  Rebuild All
                </Button>
                <Button as={Link} to="/system/indexes" size="sm">
                  View All
                </Button>
              </>
            }
          />
          <IndexSummaryTable
            indexes={Array.isArray(indexes.data) ? indexes.data.slice(0, 6) : []}
            loading={indexes.loading}
            error={indexes.error}
            onRetry={indexes.reload}
          />
          <IndexStatusCounters summary={indexSummary.data} />
        </Card>

        <Card>
          <CardHeader title="Event Monitor" subtitle="Real-time system events" icon={Zap} />
          <EventStream
            events={Array.isArray(events.data) ? events.data : []}
            loading={events.loading}
            error={events.error}
            onRetry={events.reload}
          />
          <CardLinkFooter>
            <Link to="/system/events" className="mf-link">
              View All Events →
            </Link>
          </CardLinkFooter>
        </Card>

        <Card>
          <CardHeader
            title="Background Jobs"
            subtitle="Monitor background job execution"
            icon={BriefcaseBusiness}
            actions={
              <Button as={Link} to="/system/jobs" variant="secondary" size="sm">
                View All Jobs
              </Button>
            }
          />
          <JobList
            jobs={(Array.isArray(jobs.data) ? jobs.data : []).slice(0, 5)}
            loading={jobs.loading}
            error={jobs.error}
            onRetry={jobs.reload}
          />
        </Card>

        <Card>
          <CardHeader title="Metadata Cache" subtitle="Metadata caching and performance" icon={Layers} />
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <DonutChart
              data={[
                { label: 'Hits', value: cache.data?.hits ?? cache.data?.hitRate ?? 0, color: '#10B981' },
                { label: 'Misses', value: cache.data?.misses ?? 0, color: '#E2E8F0' },
              ]}
              height={170}
              centerValue={formatPercent(cache.data?.hitRate)}
              centerLabel="Hit Rate"
            />
            <StatGrid
              columns={2}
              loading={cache.loading}
              className="sm:grid-cols-1"
              stats={[
                { label: 'Cache Size', value: formatBytes(cache.data?.sizeBytes) },
                { label: 'Cached Objects', value: cache.data?.cachedObjects ?? 0 },
                { label: 'Cached Fields', value: cache.data?.cachedFields ?? 0 },
              ]}
            />
          </div>
          <CardLinkFooter>
            <Link to="/system/cache" className="mf-link">
              Open cache console →
            </Link>
          </CardLinkFooter>
        </Card>

        <Card>
          <CardHeader title="Lookup Resolver" subtitle="Lookup resolution statistics" icon={Link2} />
          <div className="p-5">
            <StatGrid
              loading={lookups.loading}
              stats={[
                { label: 'Total Lookups', value: formatCompact(lookups.data?.total) },
                { label: 'Resolved', value: formatCompact(lookups.data?.resolved) },
                { label: 'Failed', value: formatCompact(lookups.data?.failed) },
              ]}
            />
            <p className="mt-4 mb-2 text-xs font-semibold text-slate-700">Recent Failures</p>
            <FailureBars
              emptyTitle="No resolution failures"
              items={(lookups.data?.recentFailures || []).slice(0, 4).map((failure, index) => ({
                label: `${failure.fromObject} · ${failure.field} → ${failure.toObject}`,
                count: index + 1,
                percent: 100 / ((lookups.data?.recentFailures || []).length || 1),
              }))}
            />
          </div>
          <CardLinkFooter>
            <Link to="/system/lookups" className="mf-link">
              View All Failures →
            </Link>
          </CardLinkFooter>
        </Card>

        <Card>
          <CardHeader title="Validation Engine" subtitle="Validation execution metrics" icon={ShieldCheck} />
          <div className="p-5">
            <StatGrid
              columns={2}
              loading={validation.loading}
              stats={[
                { label: 'Validations / min', value: formatCompact(validation.data?.perMin) },
                { label: 'Success Rate', value: formatPercent(validation.data?.successRate) },
                { label: 'Failed Validations', value: validation.data?.failed ?? 0 },
                { label: 'Active Rules', value: validation.data?.activeRules ?? 0 },
              ]}
            />
            <p className="mt-4 mb-2 text-xs font-semibold text-slate-700">Top Validation Failures</p>
            <FailureBars items={validation.data?.topFailures || []} emptyTitle="No validation failures" />
          </div>
          <CardLinkFooter>
            <Link to="/system/validation" className="mf-link">
              View All Rules →
            </Link>
          </CardLinkFooter>
        </Card>

        <Card className="xl:col-span-1">
          <CardHeader title="Audit Logs (Recent)" subtitle="Recent system audit activities" icon={FileClock} />
          <AuditTable
            entries={Array.isArray(audit.data) ? audit.data : []}
            loading={audit.loading}
            error={audit.error}
            onRetry={audit.reload}
            dense
          />
          <CardLinkFooter>
            <Link to="/system/audit" className="mf-link">
              View All Logs →
            </Link>
          </CardLinkFooter>
        </Card>

        <Card>
          <CardHeader title="System Logs" subtitle="System log levels overview" icon={ScrollText} />
          <div className="p-5">
            <LogLevelDonuts summary={logs.data} loading={logs.loading} />
          </div>
          <CardLinkFooter>
            <Link to="/system/logs" className="mf-link">
              View All Logs →
            </Link>
          </CardLinkFooter>
        </Card>

        <Card>
          <CardHeader
            title="Metrics & Performance"
            subtitle="System performance overview"
            icon={Activity}
          />
          <div className="p-5">
            <LineChart
              data={chartData}
              height={180}
              unit="%"
              series={[
                { key: 'cpu', label: 'CPU %', color: '#6366F1' },
                { key: 'memory', label: 'Memory %', color: '#10B981' },
                { key: 'disk', label: 'Disk %', color: '#F59E0B' },
              ]}
            />
          </div>
          <CardLinkFooter>
            <Link to="/system/metrics" className="mf-link">
              View All Metrics →
            </Link>
          </CardLinkFooter>
        </Card>

        <Card>
          <CardHeader title="Event Bus" subtitle="Message broker health" icon={Zap} />
          <div className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">In-process bus</span>
              <Badge tone={health.data?.eventBus?.status === 'UP' ? 'emerald' : 'rose'}>
                {health.data?.eventBus?.status ?? '—'}
              </Badge>
            </div>
            <StatGrid
              loading={health.loading}
              stats={[
                { label: 'Messages / min', value: formatCompact(health.data?.eventBus?.throughputPerMin) },
                { label: 'Queued', value: health.data?.eventBus?.queued ?? 0 },
                { label: 'Partitions', value: health.data?.eventBus?.partitions ?? 0 },
              ]}
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="Storage Overview" subtitle="Storage and database health" icon={HardDrive} />
          <div className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                {storage.data?.database?.name || 'Database'}
              </span>
              <StatusPill kind="health" status={storage.data?.database?.status} />
            </div>
            <p className="text-xs text-slate-500">
              {formatBytes(storage.data?.database?.usedBytes)} of{' '}
              {formatBytes(storage.data?.database?.totalBytes)}
            </p>
            <ProgressBar
              className="mt-2"
              value={storage.data?.database?.percent ?? 0}
              tone={(storage.data?.database?.percent ?? 0) > 80 ? 'rose' : 'emerald'}
            />
          </div>
          <CardLinkFooter>
            <Link to="/system/data" className="mf-link">
              View Details →
            </Link>
          </CardLinkFooter>
        </Card>

        <Card>
          <CardHeader title="Alerts & Notifications" subtitle="Active system alerts" icon={AlertTriangle} />
          {unacked.length ? (
            <ul className="divide-y divide-slate-50">
              {unacked.slice(0, 4).map((alert) => (
                <li key={alert.alertId} className="flex items-start gap-3 px-5 py-3">
                  <AlertTriangle
                    size={15}
                    className={alert.severity === 'CRITICAL' || alert.severity === 'ERROR' ? 'mt-0.5 text-rose-500' : 'mt-0.5 text-amber-500'}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{alert.title}</p>
                    <p className="truncate text-[11px] text-slate-500">{alert.message}</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-slate-400">{formatDateTime(alert.at)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-8 text-center text-sm text-slate-500">No active alerts.</p>
          )}
          <CardLinkFooter>
            <Link to="/system/alerts" className="mf-link">
              View All Alerts →
            </Link>
          </CardLinkFooter>
        </Card>

        <Card>
          <CardHeader title="System Settings" subtitle="System configuration summary" icon={Settings} />
          <dl className="divide-y divide-slate-50 px-5">
            <Row label="Environment" value={settings.data?.environment} />
            <Row label="Version" value={settings.data?.version} />
            <Row label="Indexing mode" value={settings.data?.indexingMode} />
            <Row label="Cache TTL" value={settings.data ? `${settings.data.cacheTtlSeconds}s` : '—'} />
          </dl>
          <CardLinkFooter>
            <Link to="/system/settings" className="mf-link">
              View Settings →
            </Link>
          </CardLinkFooter>
        </Card>
      </div>
    </>
  );
}

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between py-2.5">
    <dt className="text-xs text-slate-500">{label}</dt>
    <dd className="text-sm font-semibold text-slate-800">{value ?? '—'}</dd>
  </div>
);

export default SystemDashboardPage;
