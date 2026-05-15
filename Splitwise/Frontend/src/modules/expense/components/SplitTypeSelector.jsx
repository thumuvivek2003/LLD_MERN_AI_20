import { Equal, Hash, Percent } from 'lucide-react';

const OPTIONS = [
  { key: 'EQUAL', label: 'Equal', icon: Equal },
  { key: 'EXACT', label: 'Exact', icon: Hash },
  { key: 'PERCENT', label: 'Percent', icon: Percent }
];

export default function SplitTypeSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2 bg-brand-50 p-1 rounded-2xl">
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const active = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
              active ? 'bg-white text-brand-700 shadow-soft' : 'text-slate-500 hover:text-brand-600'
            }`}
          >
            <Icon className="w-4 h-4" /> {opt.label}
          </button>
        );
      })}
    </div>
  );
}
