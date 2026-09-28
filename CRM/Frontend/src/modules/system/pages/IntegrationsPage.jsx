import { Cable, Database, RefreshCw, Zap } from 'lucide-react';
import useAsync from '../../../core/hooks/useAsync.js';
import systemApi from '../../../core/api/system.api.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card, CardHeader } from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import Badge from '../../../core/components/ui/Badge.jsx';
import { SkeletonText } from '../../../core/components/ui/Skeleton.jsx';
import { ErrorState } from '../../../core/components/ui/EmptyState.jsx';
import { formatDuration } from '../../../core/utils/formatters.js';
import StatGrid from '../components/StatGrid.jsx';

const CHECK_TONE = { PASS: 'emerald', WARN: 'amber', FAIL: 'rose' };

/**
 * System → Integrations. Every dependency the engine talks to, read from
 * `GET /system/health` (`db`, `eventBus`, `checks[]`).
 */
export function IntegrationsPage() {
  const health = useAsync(() => systemApi.health(), []);
  const data = health.data;

  return (
    <>
      <PageHeader
        title="Integrations"
        subtitle="Connected services and their current health"
        icon={Cable}
        actions={
          <Button variant="secondary" icon={RefreshCw} onClick={health.reload}>
            Re-check
          </Button>
        }
      />

      {health.error ? (
        <Card>
          <ErrorState error={health.error} onRetry={health.reload} />
        </Card>
      ) : health.loading && !data ? (
        <Card className="p-6">
          <SkeletonText lines={7} />
        </Card>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          <Card>
            <CardHeader
              title="MongoDB"
              subtitle="Primary datastore"
              icon={Database}
              actions={<Badge tone={data?.db?.status === 'UP' ? 'emerald' : 'rose'}>{data?.db?.status}</Badge>}
            />
            <div className="p-5">
              <StatGrid
                columns={2}
                stats={[
                  { label: 'Latency', value: data?.db?.latencyMs != null ? `${data.db.latencyMs} ms` : '—' },
                  { label: 'Database', value: data?.db?.name || 'metaforce' },
                ]}
              />
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Event Bus"
              subtitle="In-process observer bus"
              icon={Zap}
              actions={
                <Badge tone={data?.eventBus?.status === 'UP' ? 'emerald' : 'rose'}>
                  {data?.eventBus?.status}
                </Badge>
              }
            />
            <div className="p-5">
              <StatGrid
                columns={3}
                stats={[
                  { label: 'Throughput / min', value: data?.eventBus?.throughputPerMin ?? 0 },
                  { label: 'Queued', value: data?.eventBus?.queued ?? 0 },
                  { label: 'Partitions', value: data?.eventBus?.partitions ?? 0 },
                ]}
              />
            </div>
          </Card>

          <Card className="xl:col-span-2">
            <CardHeader title="Health Checks" subtitle="Every probe run on the last check" icon={Cable} />
            <ul className="divide-y divide-slate-50">
              {(data?.checks || []).map((check) => (
                <li key={check.name} className="flex items-center gap-3 px-5 py-3">
                  <Badge tone={CHECK_TONE[check.status] || 'slate'}>{check.status}</Badge>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-800">{check.name}</span>
                    <span className="block truncate text-[11px] text-slate-500">{check.detail}</span>
                  </span>
                </li>
              ))}
              {!data?.checks?.length && (
                <li className="px-5 py-8 text-center text-sm text-slate-500">No checks reported.</li>
              )}
            </ul>
            <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-100 px-5 py-3.5 text-xs text-slate-500">
              <span>
                Environment <Badge tone="indigo">{data?.environment}</Badge>
              </span>
              <span>
                Version <Badge tone="slate">{data?.version}</Badge>
              </span>
              <span>Uptime {formatDuration(data?.uptimeMs)}</span>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

export default IntegrationsPage;
