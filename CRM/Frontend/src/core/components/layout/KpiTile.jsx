import { TrendingDown, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import cx from '../../utils/cx.js';
import { Skeleton } from '../ui/Skeleton.jsx';

const TINTS = {
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
  sky: 'bg-sky-50 text-sky-600',
  violet: 'bg-violet-50 text-violet-600',
  slate: 'bg-slate-100 text-slate-600',
};

/** The KPI header tile shared by all three consoles. */
export function KpiTile({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'indigo',
  trend,
  trendDirection = 'up',
  loading = false,
  to,
  footer,
  className,
}) {
  const Trend = trendDirection === 'down' ? TrendingDown : TrendingUp;
  const Wrapper = to ? Link : 'div';

  return (
    <Wrapper
      {...(to ? { to } : {})}
      className={cx(
        'mf-card flex flex-col gap-3 p-4 transition',
        to && 'hover:border-slate-300 hover:shadow-pop',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-500">{label}</p>
          {loading ? (
            <Skeleton className="mt-1.5 h-6 w-24" />
          ) : (
            <p className="mt-0.5 truncate text-[22px] font-bold leading-tight tracking-tight text-slate-900">
              {value}
            </p>
          )}
          {hint && !loading && <p className="mt-0.5 truncate text-[11px] text-slate-400">{hint}</p>}
        </div>
        {Icon && (
          <span
            className={cx(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
              TINTS[tone] || TINTS.indigo,
            )}
          >
            <Icon size={17} />
          </span>
        )}
      </div>

      {trend !== undefined && trend !== null && !loading && (
        <p
          className={cx(
            'inline-flex items-center gap-1 text-[11px] font-semibold',
            trendDirection === 'down' ? 'text-rose-500' : 'text-emerald-600',
          )}
        >
          <Trend size={12} />
          {trend}
        </p>
      )}

      {footer}
    </Wrapper>
  );
}

export function KpiGrid({ children, columns = 4, className }) {
  const cols = {
    3: 'sm:grid-cols-2 xl:grid-cols-3',
    4: 'sm:grid-cols-2 xl:grid-cols-4',
    5: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    7: 'sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7',
  }[columns];
  return <div className={cx('grid grid-cols-1 gap-4', cols, className)}>{children}</div>;
}

export default KpiTile;
