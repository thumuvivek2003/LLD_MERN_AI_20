import { Link } from 'react-router-dom';
import { useDashboardData } from '../hooks/useDashboard.js';
import { StatsCard } from '../components/StatsCard.jsx';
import { TrafficChart } from '../components/TrafficChart.jsx';
import { StrategyBadge } from '../components/StrategyBadge.jsx';
import { Loader } from '../../shared/components/Loader.jsx';
import { EmptyState } from '../../shared/components/EmptyState.jsx';
import {
  formatNumber,
  formatRelative,
} from '../../shared/utils/format.util.js';
import { clientDetailsPath, ROUTES } from '../../shared/constants/routes.js';

export function AdminDashboardPage() {
  const { data, loading, error } = useDashboardData('admin');

  if (loading) return <Loader />;
  if (error) {
    return (
      <EmptyState
        title="Could not load dashboard"
        description={error}
      />
    );
  }

  const d = data || {};
  const traffic = d.traffic || [];
  const topClients = d.topClients || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          label="Total Requests"
          value={d.totalRequests}
          tone="brand"
        />
        <StatsCard
          label="Active Clients"
          value={d.activeClients}
          tone="green"
        />
        <StatsCard
          label="Blocked Requests"
          value={d.totalBlocked}
          tone="red"
        />
        <StatsCard
          label="Total Allowed"
          value={d.totalAllowed}
          tone="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-800">Requests Overview</h2>
            <span className="text-xs text-slate-400">Recent traffic</span>
          </div>
          <TrafficChart data={traffic} />
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-2">
            Current Strategy
          </h2>
          <StrategyBadge strategyType={d.currentStrategy} />
          <Link
            to={ROUTES.ADMIN_STRATEGIES}
            className="btn-secondary w-full mt-4 text-sm"
          >
            Change Strategy
          </Link>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 mb-3">Top Clients</h2>
        {topClients.length === 0 ? (
          <EmptyState title="No client traffic yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 text-xs uppercase">
                  <th className="py-2 pr-4">Client</th>
                  <th className="py-2 pr-4">Requests</th>
                  <th className="py-2 pr-4">Blocked</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topClients.map((c) => (
                  <tr key={c.clientId}>
                    <td className="py-2 pr-4 text-slate-700">{c.username}</td>
                    <td className="py-2 pr-4">{formatNumber(c.requests)}</td>
                    <td className="py-2 pr-4 text-red-600">
                      {formatNumber(c.blocked)}
                    </td>
                    <td className="py-2 pr-4 text-right">
                      <Link
                        to={clientDetailsPath(c.clientId)}
                        className="text-brand-600 hover:underline text-xs"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="text-[11px] text-slate-400 mt-3">
          Last refreshed {formatRelative(new Date().toISOString())}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
