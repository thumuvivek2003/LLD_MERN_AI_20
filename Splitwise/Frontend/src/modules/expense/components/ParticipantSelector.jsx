import { Check } from 'lucide-react';
import Avatar from '../../../shared/components/Avatar.jsx';

export default function ParticipantSelector({ members = [], selected = [], onToggle }) {
  const isSelected = (uid) => selected.includes(uid);
  return (
    <div className="space-y-2">
      {members.map((m) => {
        const checked = isSelected(m.userId);
        return (
          <button
            key={m.userId}
            type="button"
            onClick={() => onToggle(m.userId)}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-colors ${
              checked
                ? 'border-brand-300 bg-brand-50'
                : 'border-slate-100 bg-white hover:border-brand-200'
            }`}
          >
            <Avatar name={m.name} />
            <div className="flex-1 text-left min-w-0">
              <div className="font-semibold text-slate-800 truncate">{m.name}</div>
            </div>
            <span
              className={`w-6 h-6 rounded-md flex items-center justify-center border ${
                checked ? 'bg-brand-500 border-brand-500 text-white' : 'border-slate-300 bg-white'
              }`}
            >
              {checked && <Check className="w-4 h-4" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
