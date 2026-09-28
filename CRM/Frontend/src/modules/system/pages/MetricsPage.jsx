import { Activity, Cpu, HardDrive, MemoryStick, RefreshCw } from 'lucide-react';
import useAsync from '../../../core/hooks/useAsync.js';
import systemApi from '../../../core/api/system.api.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card, CardHeader } from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { KpiGrid, KpiTile } from '../../../core/components/layout/KpiTile.jsx';
import { LineChart, Sparkline } from '../../../core/components/charts/index.js';
import { ErrorState } from '../../../core/components/ui/EmptyState.jsx';
import { SkeletonText } from '../../../core/components/ui/Skeleton.jsx';
import { formatBytes, formatCompact, formatPercent } from '../../../core/utils/formatters.js';

const last = (series = []) => (series.length ? series[series.length - 1].v : null);

/** System → Metrics. CPU / memory / disk time series plus live counters. */
export function MetricsPage() {
  const metrics = useAsync(() => systemApi.metrics(), []);
  const series = metrics.data?.series || {};

  const chartData = (series.cpu || []).map((point, index) => ({
    t: new Date(point.t).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    cpu: point.v,
    memory: series.memory?.[index]?.v ?? 0,
    disk: series.disk?.[index]?.v ?? 0,
  }));

  return (
    <>
      <PageHeader
        title="Metrics & Performance"
        subtitle="Resource usage and throughput over the recent window"
        icon={Activity}
        actions={
          <Button variant="secondary" icon={RefreshCw} onClick={metrics.reload}>
            Refresh
          </Button>
        }
      />

      <KpiGrid columns={4} className="mb-5">
        <KpiTile
          label="CPU Usage"
          value={formatPercent(last(series.cpu), 0)}
          icon={Cpu}
          tone="indigo"
          loading={metrics.loading}
          footer={<Sparkline data={series.cpu || []} color="#6366F1" />}
        />
        <KpiTile
          label="Memory Usage"
          value={formatPercent(last(series.memory), 0)}
          icon={MemoryStick}
          tone="emerald"
          loading={metrics.loading}
          footer={<Sparkline data={series.memory || []} color="#10B981" />}
        />
        <KpiTile
          label="Disk Usage"
          value={formatPercent(last(series.disk) ?? metrics.data?.storage?.percent, 0)}
          icon={HardDrive}
          tone="amber"
          loading={metrics.loading}
          footer={<Sparkline data={series.disk || []} color="#F59E0B" />}
        />
        <KpiTile
          label="Storage"
          value={formatBytes(metrics.data?.storage?.usedBytes)}
          hint={metrics.data?.storage ? `of ${formatBytes(metrics.data.storage.totalBytes)}` : ''}
          icon={HardDrive}
          tone="violet"
          loading={metrics.loading}
        />
      </KpiGrid>

      <Card className="mb-5">
        <CardHeader title="Resource Usage" subtitle="CPU, memory and disk over time" icon={Activity} />
        <div className="p-5">
          {metrics.error ? (
            <ErrorState error={metrics.error} onRetry={metrics.reload} compact />
          ) : metrics.loading && !chartData.length ? (
            <SkeletonText lines={6} />
          ) : (
            <LineChart
              data={chartData}
              height={280}
              unit="%"
              series={[
                { key: 'cpu', label: 'CPU %', color: '#6366F1' },
                { key: 'memory', label: 'Memory %', color: '#10B981' },
                { key: 'disk', label: 'Disk %', color: '#F59E0B' },
              ]}
            />
          )}
        </div>
      </Card>

      <KpiGrid columns={4}>
        <KpiTile label="Events / min" value={formatCompact(metrics.data?.eventsPerMin)} icon={Activity} tone="indigo" loading={metrics.loading} />
        <KpiTile label="Jobs Running" value={metrics.data?.jobsRunning ?? 0} icon={Activity} tone="sky" loading={metrics.loading} />
        <KpiTile label="Jobs Queued" value={metrics.data?.jobsQueued ?? 0} icon={Activity} tone="amber" loading={metrics.loading} />
        <KpiTile label="Errors (15 min)" value={metrics.data?.errors15m ?? 0} icon={Activity} tone={metrics.data?.errors15m ? 'rose' : 'slate'} loading={metrics.loading} />
      </KpiGrid>
    </>
  );
}

export default MetricsPage;
