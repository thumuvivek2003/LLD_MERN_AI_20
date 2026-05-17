import { useNavigate, useParams } from 'react-router-dom';
import { Avatar } from '../../../shared/components/Avatar.jsx';
import { MessageStatusIcon } from './MessageStatusIcon.jsx';
import { formatChatListTime } from '../../../shared/utils/format-date.util.js';
import { ROUTES } from '../../../shared/constants/routes.constant.js';
import { resolveChatStrategy } from '../strategies/index.js';
import { useUserStore } from '../../user/store/user.store.js';
import { useAuthStore } from '../../auth/store/auth.store.js';

export function ChatCard({ chat }) {
  const navigate = useNavigate();
  const { chatId: activeId } = useParams();
  const isActive = activeId === chat.id;
  const currentUser = useAuthStore((s) => s.user);
  const onlineIds = useUserStore((s) => s.onlineIds);
  const lastSeenMap = useUserStore((s) => s.lastSeenMap);

  const strategy = resolveChatStrategy(chat);
  const meta = strategy.render({
    chat,
    currentUserId: currentUser?.id,
    isOnline: (id) => onlineIds.has(id),
    getLastSeen: (id) => lastSeenMap[id] || null,
  });

  const last = chat.lastMessage;
  const lastIsMine = last && last.senderId === currentUser?.id;

  return (
    <button
      type="button"
      onClick={() => navigate(ROUTES.CHAT_DETAIL(chat.id))}
      className={`flex w-full items-center gap-3 border-b border-wa-border px-3 py-3 text-left hover:bg-wa-light ${
        isActive ? 'bg-wa-light' : 'bg-white'
      }`}
    >
      <Avatar name={meta.avatarSeed} online={meta.online} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium text-wa-dark">
            {meta.title}
          </span>
          {last ? (
            <span className="shrink-0 text-[10px] text-wa-muted">
              {formatChatListTime(last.createdAt)}
            </span>
          ) : null}
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1 truncate text-xs text-wa-muted">
            {lastIsMine ? <MessageStatusIcon status={last.status} /> : null}
            <span className="truncate">
              {last ? last.content : 'Say hi!'}
            </span>
          </span>
          {chat.unreadCount > 0 ? (
            <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-wa-primary px-1.5 text-[10px] font-semibold text-white">
              {chat.unreadCount}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}
