import { useState } from 'react';
import { AlertTriangle, Bell, Check, RefreshCw } from 'lucide-react';
import useAsync from '../../../core/hooks/useAsync.js';
import systemApi from '../../../core/api/system.api.js';
import { useToast } from '../../../core/context/ToastContext.jsx';
import { ALERT_SEVERITY_TONE } from '../../../shared/enums/log-level.enum.js';
import PageHeader from '../../../core/components/layout/PageHeader.jsx';
import { Card, CardHeader } from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import Badge from '../../../core/components/ui/Badge.jsx';
import { KpiGrid, KpiTile } from '../../../core/components/layout/KpiTile.jsx';
import { EmptyState, ErrorState } from '../../../core/components/ui/EmptyState.jsx';
import { SkeletonText } from '../../../core/components/ui/Skeleton.jsx';
import { formatRelative } from '../../../core/utils/formatters.js';
import cx from '../../../core/utils/cx.js';

/** System → Alerts & Notifications, with per-alert acknowledgement. */
export function AlertsPage() {
  const toast = useToast();
  const alerts = useAsync(() => systemApi.alerts(), [], { initialData: [] });
  const [busyId, setBusyId] = useState(null);

  const list = Array.isArray(alerts.data) ? alerts.data : [];
  const unacked = list.filter((alert) => !alert.acknowledged);
  const critical = list.filter((alert) => alert.severity === 'CRITICAL' && !alert.acknowledged);

  const ack = async (alert) => {
    setBusyId(alert.alertId);
    try {
      await systemApi.ackAlert(alert.alertId);
      await alerts.reload();
      toast.success('Alert acknowledged', alert.title);
    } catch (err) {
      toast.fromError(err, 'Could not acknowledge alert');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Alerts & Notifications"
        subtitle="Everything the platform wants you to look at"
        icon={Bell}
        actions={
          <Button variant="secondary" icon={RefreshCw} onClick={alerts.reload}>
            Refresh
          </Button>
        }
      />

      <KpiGrid columns={3} className="mb-5">
        <KpiTile label="Total Alerts" value={list.length} icon={Bell} tone="indigo" loading={alerts.loading} />
        <KpiTile label="Unacknowledged" value={unacked.length} icon={AlertTriangle} tone={unacked.length ? 'amber' : 'slate'} loading={alerts.loading} />
        <KpiTile label="Critical" value={critical.length} icon={AlertTriangle} tone={critical.length ? 'rose' : 'slate'} loading={alerts.loading} />
      </KpiGrid>

      <Card>
        <CardHeader title="Active Alerts" subtitle="Newest first" icon={Bell} />
        {alerts.error ? (
          <ErrorState error={alerts.error} onRetry={alerts.reload} />
        ) : alerts.loading && !list.length ? (
          <div className="p-5">
            <SkeletonText lines={6} />
          </div>
        ) : !list.length ? (
          <EmptyState icon={Bell} title="No alerts" description="The platform is quiet right now." />
        ) : (
          <ul className="divide-y divide-slate-50">
            {list.map((alert) => (
              <li
                key={alert.alertId}
                className={cx('flex flex-wrap items-start gap-3 px-5 py-3.5', alert.acknowledged && 'opacity-60')}
              >
                <AlertTriangle
                  size={17}
                  className={cx(
                    'mt-0.5 shrink-0',
                    alert.severity === 'CRITICAL' || alert.severity === 'ERROR'
                      ? 'text-rose-500'
                      : 'text-amber-500',
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
                    <Badge tone={ALERT_SEVERITY_TONE[alert.severity] || 'slate'}>{alert.severity}</Badge>
                    {alert.acknowledged && <Badge tone="slate">Acknowledged</Badge>}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{alert.message}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{formatRelative(alert.at)}</p>
                </div>
                {!alert.acknowledged && (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Check}
                    loading={busyId === alert.alertId}
                    onClick={() => ack(alert)}
                  >
                    Acknowledge
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}

export default AlertsPage;
