export function UsageProgress({ remaining = 0, total = 0, label = 'Remaining' }) {
  const pct = total > 0 ? Math.max(0, Math.min(100, (remaining / total) * 100)) : 0;
  const danger = pct < 20;
  return (
    <div>
      <div className="flex items-end justify-between mb-2">
        <div className="text-3xl font-semibold text-slate-800">
          {remaining}
          <span className="text-sm text-slate-400 ml-2">/ {total}</span>
        </div>
        <div className="text-xs text-slate-500">{label}</div>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full ${danger ? 'bg-red-500' : 'bg-brand-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default UsageProgress;
