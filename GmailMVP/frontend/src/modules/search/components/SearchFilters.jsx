import { SEARCH_TYPES } from '../../../shared/strategy/SearchContext.js';

/**
 * Filter chips that select the active search Strategy (All/From/To/Subject).
 */
export default function SearchFilters({ type, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {SEARCH_TYPES.map((t) => {
        const active = t.key === type;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              active
                ? 'brand-gradient text-white shadow-soft'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
