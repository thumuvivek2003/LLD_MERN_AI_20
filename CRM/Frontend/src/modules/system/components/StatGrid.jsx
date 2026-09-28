import cx from '../../../core/utils/cx.js';
import { Skeleton } from '../../../core/components/ui/Skeleton.jsx';

/**
 * The small bordered stat boxes that fill most System console panels
 * (Total Lookups / Resolved / Failed, Validations per min, …).
 */
export function StatGrid({ stats = [], columns = 3, loading, className }) {
  const cols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-2 xl:grid-cols-4',
  }[columns];

  return (
    <dl className={cx('grid grid-cols-1 gap-3', cols, className)}>
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-slate-200 px-3.5 py-3">
          <dt className="text-[11px] font-medium text-slate-500">{stat.label}</dt>
          {loading ? (
            <Skeleton className="mt-1.5 h-5 w-20" />
          ) : (
            <dd className="mt-0.5 text-lg font-bold text-slate-900">{stat.value}</dd>
          )}
          {stat.hint && !loading && (
            <p
              className={cx(
                'mt-0.5 text-[11px]',
                stat.tone === 'up'
                  ? 'text-emerald-600'
                  : stat.tone === 'down'
                    ? 'text-rose-500'
                    : 'text-slate-400',
              )}
            >
              {stat.hint}
            </p>
          )}
        </div>
      ))}
    </dl>
  );
}

export default StatGrid;
