export function OnlineBadge({ online }) {
  if (!online) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-600">
      <span className="h-1.5 w-1.5 rounded-full bg-wa-primary" />
      online
    </span>
  );
}
