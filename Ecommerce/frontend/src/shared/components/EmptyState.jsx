export default function EmptyState({ title = 'Nothing here yet', message = '', action = null, icon = '📦' }) {
  return (
    <div className="card flex flex-col items-center justify-center text-center py-12">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      {message && <p className="text-sm text-slate-500 mt-1 max-w-md">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
