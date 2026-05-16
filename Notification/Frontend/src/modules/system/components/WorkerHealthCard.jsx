export function WorkerHealthCard({ workers = [] }) {
  if (!workers || workers.length === 0) {
    return (
      <div className="card p-4 text-sm text-slate-400">
        No worker data reported.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {workers.map((w) => (
        <div key={w.id} className="card p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-800">{w.id}</div>
            <div className="text-xs text-slate-500">
              Last seen: {w.lastSeen || '—'}
            </div>
          </div>
          <span
            className={`pill ${
              w.healthy
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                : 'bg-red-50 text-red-700 ring-1 ring-red-200'
            }`}
          >
            {w.healthy ? 'healthy' : 'down'}
          </span>
        </div>
      ))}
    </div>
  );
}
