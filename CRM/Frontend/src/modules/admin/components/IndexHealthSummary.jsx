import { Link } from 'react-router-dom';
import { Database } from 'lucide-react';
import { Card, CardHeader } from '../../../core/components/ui/Card.jsx';
import { ErrorState } from '../../../core/components/ui/EmptyState.jsx';
import { Skeleton } from '../../../core/components/ui/Skeleton.jsx';
import ProgressBar from '../../../core/components/charts/ProgressBar.jsx';
import { DOTS } from '../../../core/components/ui/Badge.jsx';
import cx from '../../../core/utils/cx.js';

const ROWS = [
  { key: 'healthy', label: 'Healthy', tone: 'emerald' },
  { key: 'building', label: 'Building', tone: 'amber' },
  { key: 'failed', label: 'Failed', tone: 'rose' },
  { key: 'inactive', label: 'Inactive', tone: 'slate' },
];

/** `GET /indexes/summary` rendered as a health bar + four counters. */
export function IndexHealthSummary({ summary, loading, error, onRetry }) {
  const total = summary?.total ?? 0;
  const healthPct = total ? ((summary?.healthy ?? 0) / total) * 100 : 0;

  return (
    <Card>
      <CardHeader
        title="Index Health"
        subtitle="Search index availability"
        icon={Database}
        actions={
          <Link to="/admin/indexes" className="text-xs font-semibold text-accent hover:underline">
            Manage
          </Link>
        }
      />
      <div className="p-5">
        {error ? (
          <ErrorState error={error} onRetry={onRetry} compact />
        ) : loading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <>
            <div className="mb-1 flex items-end justify-between">
              <p className="text-2xl font-bold text-slate-900">{healthPct.toFixed(0)}%</p>
              <p className="text-xs text-slate-400">
                {summary?.healthy ?? 0} / {total} healthy
              </p>
            </div>
            <ProgressBar value={healthPct} tone={healthPct > 90 ? 'emerald' : 'amber'} />
            <dl className="mt-4 grid grid-cols-2 gap-2">
              {ROWS.map((row) => (
                <div
                  key={row.key}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                >
                  <dt className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                    <span className={cx('h-1.5 w-1.5 rounded-full', DOTS[row.tone])} />
                    {row.label}
                  </dt>
                  <dd className="text-sm font-bold text-slate-800">{summary?.[row.key] ?? 0}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </div>
    </Card>
  );
}

export default IndexHealthSummary;
