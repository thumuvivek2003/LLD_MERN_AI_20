export function DashboardStatsCard({
  label,
  value,
  delta,
  accent = 'brand',
  icon,
}) {
  const accents = {
    brand: 'bg-brand-50 text-brand-700',
    success: 'bg-emerald-50 text-emerald-700',
    warn: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-700',
    slate: 'bg-slate-100 text-slate-700',
  };
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </div>
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${
            accents[accent] || accents.brand
          }`}
        >
          {icon || '•'}
        </div>
      </div>
      <div className="mt-3 text-3xl font-bold text-slate-900">{value ?? 0}</div>
      {delta != null && (
        <div className="text-xs text-slate-400 mt-1">{delta}</div>
      )}
    </div>
  );
}
