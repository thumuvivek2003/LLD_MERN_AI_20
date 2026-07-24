import Avatar from '../../../shared/components/Avatar.jsx';
import { CheckIcon } from '../../../shared/components/Icons.jsx';

export default function UserCard({ user, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(user)}
      className={`flex w-full items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-left transition-all ${
        selected
          ? 'border-brand-300 bg-brand-50/70 shadow-soft'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <Avatar name={user.name} color={user.avatarColor} size="md" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">
          {user.name}
        </p>
        <p className="truncate text-xs text-slate-400">{user.email}</p>
      </div>
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full transition ${
          selected
            ? 'brand-gradient text-white'
            : 'border border-slate-200 text-transparent'
        }`}
      >
        <CheckIcon size={14} />
      </span>
    </button>
  );
}
