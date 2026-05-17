import { Avatar } from '../../../shared/components/Avatar.jsx';
import { Button } from '../../../shared/components/Button.jsx';

export function GroupMemberList({
  members = [],
  currentUserId,
  isCurrentUserAdmin,
  onRemove,
}) {
  return (
    <div className="divide-y divide-wa-border">
      {members.map((m) => {
        const isSelf = m.userId === currentUserId;
        const canRemove = isCurrentUserAdmin && !isSelf;
        return (
          <div
            key={m.userId}
            className="flex items-center gap-3 px-4 py-3"
          >
            <Avatar name={m.name} online={m.isOnline} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-wa-dark">
                {m.name} {isSelf ? <span className="text-wa-muted">(you)</span> : null}
              </div>
              <div className="text-xs text-wa-muted">
                +91 {m.mobile} · {m.role}
              </div>
            </div>
            {canRemove ? (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onRemove?.(m.userId)}
              >
                Remove
              </Button>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
