import { CHANNELS } from '../../../shared/constants/notification.constants.js';

export function NotificationChannelTabs({ active, onChange }) {
  return (
    <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1 w-fit">
      <button
        onClick={() => onChange(null)}
        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
          !active ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600'
        }`}
      >
        All
      </button>
      {CHANNELS.map((c) => (
        <button
          key={c.key}
          onClick={() => onChange(c.key)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            active === c.key
              ? 'bg-white text-brand-700 shadow-sm'
              : 'text-slate-600'
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
