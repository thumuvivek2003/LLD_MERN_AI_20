export function Spinner({ size = 22, className = '' }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-brand-200 border-t-brand-500 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
      <Spinner size={28} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

// A shimmering placeholder row for mail lists.
export function MailSkeleton({ rows = 6 }) {
  return (
    <div className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/4 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
          </div>
          <div className="h-3 w-12 animate-pulse rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

export default Loader;
