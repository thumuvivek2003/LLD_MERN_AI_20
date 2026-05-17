import { useDashboardData } from '../hooks/useDashboard.js';
import { Loader } from '../../shared/components/Loader.jsx';
import { EmptyState } from '../../shared/components/EmptyState.jsx';
import { UsageHistoryChart } from '../../users/components/UsageHistoryChart.jsx';
import { formatRelative } from '../../shared/utils/format.util.js';

export function UsageHistoryPage() {
  const { data, loading, error } = useDashboardData('client');
  if (loading) return <Loader />;
  if (error)
    return <EmptyState title="Could not load history" description={error} />;

  const logs = data?.recentLogs || [];
  // bucket logs into per-minute counts for the bar chart
  const buckets = new Map();
  logs.forEach((log) => {
    const key = new Date(log.at).toISOString().slice(0, 16);
    if (!buckets.has(key)) buckets.set(key, { label: key.slice(11), value: 0 });
    buckets.get(key).value += 1;
  });
  const chartData = Array.from(buckets.values()).slice(-12);

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 mb-4">
          Requests Per Minute
        </h2>
        <UsageHistoryChart data={chartData} />
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 mb-3">Activity Log</h2>
        {logs.length === 0 ? (
          <EmptyState title="No history yet" />
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 text-xs uppercase">
                <th className="py-2 pr-4">Endpoint</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log, idx) => (
                <tr key={idx}>
                  <td className="py-2 pr-4 text-slate-700">
                    {log.endpoint || '/request'}
                  </td>
                  <td className="py-2 pr-4">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        log.allowed
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {log.allowed ? 'allowed' : 'blocked'}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-slate-400 text-xs">
                    {formatRelative(log.at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default UsageHistoryPage;
