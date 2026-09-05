// modules/auth/components/UserCard.jsx — one selectable user row (presentational).
import { Avatar } from '../../../core/components/Avatar.jsx';

export function UserCard({ user, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(user)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-left ${
        selected ? 'bg-wa-green/15 ring-1 ring-wa-green' : 'hover:bg-wa-panel2'
      }`}
    >
      <Avatar user={user} size={44} />
      <span className="flex-1 font-medium">{user.name}</span>
      <span
        className={`h-5 w-5 rounded-full border-2 grid place-items-center ${
          selected ? 'border-wa-green bg-wa-green' : 'border-wa-line'
        }`}
      >
        {selected && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0B141A" strokeWidth="3">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </button>
  );
}
