// modules/status/components/FeedItem.jsx — one friend row in the feed
// (presentational). Ring color reflects seen/unseen state.
import { Avatar } from '../../../core/components/Avatar.jsx';

export function FeedItem({ model, onOpen }) {
  const { user, hasUnseen, unseenCount, total, timeLabel } = model;
  return (
    <button
      onClick={() => onOpen(user.id)}
      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-wa-panel2 transition text-left"
    >
      <div className="relative">
        <Avatar user={user} size={52} ring={hasUnseen ? 'unseen' : 'seen'} />
        {hasUnseen && unseenCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 rounded-full bg-wa-green text-wa-ink text-[11px] font-bold grid place-items-center ring-2 ring-wa-panel">
            {unseenCount}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{user.name}</p>
        <p className="text-xs text-wa-muted truncate">
          {hasUnseen ? `${unseenCount} new` : 'Viewed'} · {timeLabel}
          {total > 1 && ` · ${total} updates`}
        </p>
      </div>
    </button>
  );
}
