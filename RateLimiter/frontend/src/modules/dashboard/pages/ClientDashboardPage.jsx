import { useEffect, useState } from 'react';
import { useDashboardData } from '../hooks/useDashboard.js';
import { StatsCard } from '../components/StatsCard.jsx';
import { UsageProgress } from '../components/UsageProgress.jsx';
import { StrategyBadge } from '../components/StrategyBadge.jsx';
import { Loader } from '../../shared/components/Loader.jsx';
import { EmptyState } from '../../shared/components/EmptyState.jsx';
import { formatRelative } from '../../shared/utils/format.util.js';

function ResetCountdown({ seconds }) {
  const [remaining, setRemaining] = useState(seconds || 0);
  useEffect(() => {
    setRemaining(seconds || 0);
    if (!seconds || seconds <= 0) return undefined;
    const id = setInterval(
      () => setRemaining((r) => (r > 0 ? r - 1 : 0)),
      1000,
    );
    return () => clearInterval(id);
  }, [seconds]);
  return (
    <div className="text-3xl font-semibold text-slate-800">
      {Math.max(0, remaining)}
      <span className="text-sm text-slate-400 ml-1">s</span>
    </div>
  );
}

export function ClientDashboardPage() {
  const { data, loading, error } = useDashboardData('client');

  if (loading) return <Loader />;
  if (error) {
    return <EmptyState title="Could not load usage" description={error} />;
  }

  const d = data || {};
  const total = (d.remainingTokens || 0) + (d.allowed || 0);
  const allowedPct = total > 0 ? Math.round(((d.allowed || 0) / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="text-xs uppercase text-slate-500 mb-1">Status</div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
            <span className="h-2 w-2 bg-emerald-500 rounded-full" />
            Allowed
          </span>
          <div className="mt-3 text-xs text-slate-500">
            You are within your quota.
          </div>
        </div>

        <div className="card p-5">
          <div className="text-xs uppercase text-slate-500 mb-1">
            Remaining Tokens
          </div>
          <UsageProgress
            remaining={d.remainingTokens || 0}
            total={Math.max(d.remainingTokens || 0, 100)}
            label="available"
          />
        </div>

        <div className="card p-5">
          <div className="text-xs uppercase text-slate-500 mb-1">
            Resets In
          </div>
          <ResetCountdown seconds={d.resetAfterSeconds} />
          <div className="text-xs text-slate-400 mt-1">
            Window resets automatically
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard label="Allowed" value={d.allowed} tone="green" />
        <StatsCard label="Blocked" value={d.blocked} tone="red" />
        <div className="card p-4">
          <div className="text-xs uppercase text-slate-500 mb-1">
            Active Strategy
          </div>
          <StrategyBadge strategyType={d.strategy} />
          <div className="text-xs text-slate-400 mt-2">
            Allowed rate: {allowedPct}%
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-slate-800 mb-3">Recent Activity</h2>
        {(d.recentLogs || []).length === 0 ? (
          <EmptyState title="No recent requests" />
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {d.recentLogs.map((log, idx) => (
              <li
                key={idx}
                className="py-2 flex items-center justify-between"
              >
                <span className="text-slate-600">
                  {log.endpoint || '/request'}
                </span>
                <span className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      log.allowed
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {log.allowed ? 'allowed' : 'blocked'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatRelative(log.at)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ClientDashboardPage;
