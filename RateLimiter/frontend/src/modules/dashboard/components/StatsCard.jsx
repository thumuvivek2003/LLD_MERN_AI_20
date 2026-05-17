import { formatNumber } from '../../shared/utils/format.util.js';

const TONES = {
  brand: 'bg-brand-50 text-brand-700',
  green: 'bg-emerald-50 text-emerald-700',
  red: 'bg-red-50 text-red-700',
  amber: 'bg-amber-50 text-amber-700',
};

export function StatsCard({ label, value, tone = 'brand', sub }) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wide text-slate-500">
          {label}
        </div>
        <span
          className={`h-7 w-7 rounded-md grid place-items-center text-xs font-bold ${TONES[tone]}`}
        >
          {label?.[0] || '#'}
        </span>
      </div>
      <div className="mt-2 text-2xl font-semibold text-slate-800">
        {formatNumber(value)}
      </div>
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
    </div>
  );
}

export default StatsCard;
