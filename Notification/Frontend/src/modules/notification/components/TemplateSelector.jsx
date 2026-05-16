import { useTemplates } from '../../template/hooks/useTemplates.js';
import { Loader } from '../../../shared/components/Loader.jsx';

export function TemplateSelector({ value, onChange, channelFilter }) {
  const { templates, loading, error } = useTemplates();

  if (loading) return <Loader label="Loading templates…" size="sm" />;
  if (error) return <div className="text-sm text-red-600 py-3">{error}</div>;

  const filtered = channelFilter
    ? templates.filter((t) => t.channel === channelFilter)
    : templates;

  if (filtered.length === 0) {
    return (
      <div className="text-sm text-slate-400 py-3">
        No templates available{channelFilter ? ` for ${channelFilter}` : ''}.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {filtered.map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`text-left rounded-xl border p-3 transition-all ${
              active
                ? 'border-brand-400 bg-brand-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-sm font-semibold text-slate-900">{t.name}</div>
            <div className="text-xs text-slate-500 mt-0.5">
              {t.eventType} · {t.channel} · v{t.activeVersion}
            </div>
          </button>
        );
      })}
    </div>
  );
}
