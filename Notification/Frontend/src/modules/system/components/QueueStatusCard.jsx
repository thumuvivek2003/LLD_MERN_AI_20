export function QueueStatusCard({ queue }) {
  if (!queue) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card p-5">
        <div className="text-xs uppercase tracking-wider text-slate-500">
          Pending jobs
        </div>
        <div className="text-3xl font-bold mt-2">{queue.size ?? 0}</div>
      </div>
      <div className="card p-5">
        <div className="text-xs uppercase tracking-wider text-slate-500">
          Workers
        </div>
        <div className="text-3xl font-bold mt-2">{queue.workers ?? 0}</div>
      </div>
      <div className="card p-5">
        <div className="text-xs uppercase tracking-wider text-slate-500">
          Status
        </div>
        <div className="mt-2 inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-slate-800">Healthy</span>
        </div>
      </div>
    </div>
  );
}
