import { AlertTriangle, BriefcaseBusiness, Database, Gauge, HardDrive, Layers, Zap } from 'lucide-react';
import { KpiGrid, KpiTile } from '../../../core/components/layout/KpiTile.jsx';
import { formatBytes, formatCompact, formatPercent } from '../../../core/utils/formatters.js';

/** The 7 KPI tiles across the top of the System dashboard. */
export function SystemKpiRow({ health, metrics, loading }) {
  const indexHealth = metrics?.indexHealth;

  return (
    <KpiGrid columns={7}>
      <KpiTile
        label="System Health"
        value={health?.status ?? '—'}
        hint={health?.status === 'Healthy' ? 'All systems operational' : 'Attention required'}
        icon={Gauge}
        tone={health?.status === 'Healthy' ? 'emerald' : 'amber'}
        loading={loading}
      />
      <KpiTile
        label="Events / min"
        value={formatCompact(metrics?.eventsPerMin)}
        icon={Zap}
        tone="indigo"
        loading={loading}
        to="/system/events"
      />
      <KpiTile
        label="Jobs Running"
        value={metrics?.jobsRunning ?? 0}
        hint={`${metrics?.jobsQueued ?? 0} queued`}
        icon={BriefcaseBusiness}
        tone="amber"
        loading={loading}
        to="/system/jobs"
      />
      <KpiTile
        label="Cache Hit Rate"
        value={formatPercent(metrics?.cacheHitRate)}
        hint="Metadata cache"
        icon={Layers}
        tone="sky"
        loading={loading}
        to="/system/cache"
      />
      <KpiTile
        label="Index Health"
        value={indexHealth ? `${indexHealth.active} / ${indexHealth.total}` : '—'}
        hint="Active indexes"
        icon={Database}
        tone="emerald"
        loading={loading}
        to="/system/indexes"
      />
      <KpiTile
        label="Errors (15 min)"
        value={metrics?.errors15m ?? 0}
        icon={AlertTriangle}
        tone={metrics?.errors15m ? 'rose' : 'slate'}
        loading={loading}
        to="/system/logs"
      />
      <KpiTile
        label="Storage Used"
        value={formatBytes(metrics?.storage?.usedBytes)}
        hint={metrics?.storage ? `of ${formatBytes(metrics.storage.totalBytes)}` : ''}
        icon={HardDrive}
        tone="violet"
        loading={loading}
        to="/system/data"
      />
    </KpiGrid>
  );
}

export default SystemKpiRow;
