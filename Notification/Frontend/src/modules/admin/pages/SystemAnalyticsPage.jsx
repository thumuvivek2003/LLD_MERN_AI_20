import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../layouts/DashboardLayout.jsx';
import { Card } from '../../../shared/components/Card.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { fetchStats } from '../services/adminNotification.service.js';

export function SystemAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchStats()
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Loader />;
  if (error)
    return <EmptyState title="Couldn't load stats" description={error} icon="⚠️" />;
  if (!data) return <EmptyState title="No analytics yet" />;

  const byStatus = data.byStatus || data.statuses || {};
  const byChannel = data.byChannel || {};
  const byEvent = data.byEventType || data.byEvent || {};

  return (
    <DashboardLayout
      title="Analytics"
      subtitle="Aggregated delivery counts (status / channel / event)"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="By Status">
          <BreakdownList items={byStatus} />
        </Card>
        <Card title="By Channel">
          <BreakdownList items={byChannel} />
        </Card>
        <Card title="By Event Type">
          <BreakdownList items={byEvent} />
        </Card>
      </div>
    </DashboardLayout>
  );
}

function BreakdownList({ items }) {
  const entries = Object.entries(items || {});
  if (entries.length === 0)
    return <div className="text-sm text-slate-400">No data.</div>;
  const max = Math.max(...entries.map(([, v]) => Number(v) || 0));
  return (
    <ul className="space-y-2">
      {entries.map(([k, v]) => {
        const pct = max > 0 ? (Number(v) / max) * 100 : 0;
        return (
          <li key={k}>
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span className="font-medium text-slate-700">{k}</span>
              <span className="text-slate-500">{v}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full"
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
