import { formatLastSeen } from '../../../shared/utils/format-date.util.js';

export function LastSeenLabel({ online, lastSeen }) {
  if (online) return <span className="text-xs text-wa-primary">online</span>;
  if (!lastSeen)
    return <span className="text-xs text-wa-muted">last seen recently</span>;
  return (
    <span className="text-xs text-wa-muted">
      last seen {formatLastSeen(lastSeen)}
    </span>
  );
}
