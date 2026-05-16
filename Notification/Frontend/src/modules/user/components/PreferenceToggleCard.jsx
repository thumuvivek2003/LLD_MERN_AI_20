export function PreferenceToggleCard({
  channel,
  enabled,
  onToggle,
  description,
}) {
  return (
    <div className="card p-5 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-base font-semibold border ${channel.color}`}
        >
          {channel.label[0]}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            {channel.label}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {description || channel.description}
          </p>
        </div>
      </div>
      <button
        onClick={() => onToggle(!enabled)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
          enabled ? 'bg-brand-600' : 'bg-slate-200'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
