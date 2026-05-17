import { Avatar } from '../../../shared/components/Avatar.jsx';
import { LastSeenLabel } from './LastSeenLabel.jsx';

export function UserCard({ user, online, lastSeen, onClick, right }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-wa-border px-4 py-3 text-left hover:bg-wa-light"
    >
      <Avatar name={user.name} online={online} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-wa-dark">
          {user.name}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-wa-muted">+91 {user.mobile}</span>
          <LastSeenLabel online={online} lastSeen={lastSeen} />
        </div>
      </div>
      {right ? <div className="ml-2">{right}</div> : null}
    </button>
  );
}
