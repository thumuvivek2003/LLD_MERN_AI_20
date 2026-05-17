export function EmptyState({ title = 'Nothing here yet', description, action }) {
  return (
    <div className="text-center py-12 text-slate-500">
      <div className="text-lg font-semibold text-slate-700">{title}</div>
      {description && <p className="mt-2 text-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default EmptyState;
