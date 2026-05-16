import { CHANNELS } from '../../../shared/constants/notification.constants.js';

export function ChannelSelector({ selected = [], onChange }) {
  const toggle = (key) => {
    onChange(
      selected.includes(key)
        ? selected.filter((k) => k !== key)
        : [...selected, key],
    );
  };
  return (
    <div className="grid grid-cols-3 gap-3">
      {CHANNELS.map((c) => {
        const isOn = selected.includes(c.key);
        return (
          <button
            key={c.key}
            onClick={() => toggle(c.key)}
            className={`rounded-2xl border p-4 text-left transition-all ${
              isOn
                ? 'border-brand-400 bg-brand-50 shadow-soft'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold border ${c.color}`}
            >
              {c.label[0]}
            </div>
            <div className="mt-3 text-sm font-semibold text-slate-900">
              {c.label}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
              {c.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
