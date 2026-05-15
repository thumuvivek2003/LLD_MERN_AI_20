export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="bg-white/60 border border-dashed border-brand-200 rounded-3xl p-8 text-center">
      {Icon && (
        <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
