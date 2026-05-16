export function EmptyState({
  title = 'Nothing here yet',
  description = '',
  action = null,
  icon = '📭',
}) {
  return (
    <div className="card p-10 flex flex-col items-center justify-center text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h4 className="text-base font-semibold text-slate-800">{title}</h4>
      {description && (
        <p className="text-sm text-slate-500 mt-1 max-w-md">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
