import ProgressBar from '../../../core/components/charts/ProgressBar.jsx';
import { EmptyState } from '../../../core/components/ui/EmptyState.jsx';
import { formatPercent } from '../../../core/utils/formatters.js';

/** "Top Validation Failures" style list — label, count, bar, percentage. */
export function FailureBars({ items = [], emptyTitle = 'No failures recorded' }) {
  if (!items.length) return <EmptyState title={emptyTitle} compact />;

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.rule || item.label} className="flex items-center gap-3">
          <span className="w-44 shrink-0 truncate text-xs text-slate-600">
            {item.rule || item.label}
          </span>
          <span className="w-6 shrink-0 text-right text-xs font-bold text-slate-800">
            {item.count}
          </span>
          <span className="min-w-0 flex-1">
            <ProgressBar value={item.percent} tone="rose" size="sm" />
          </span>
          <span className="w-12 shrink-0 text-right text-[11px] text-slate-500">
            {formatPercent(item.percent)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default FailureBars;
