export function StatsCard({ title, value, hint }) {
  return (
    <div className="rounded-lg border border-wa-border bg-white p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-wa-muted">
        {title}
      </div>
      <div className="mt-1 text-2xl font-semibold text-wa-dark">
        {value ?? '–'}
      </div>
      {hint ? (
        <div className="mt-1 text-xs text-wa-muted">{hint}</div>
      ) : null}
    </div>
  );
}
