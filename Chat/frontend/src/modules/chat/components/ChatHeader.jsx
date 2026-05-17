import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../../shared/components/Avatar.jsx';
import { TypingIndicator } from './TypingIndicator.jsx';
import { ROUTES } from '../../../shared/constants/routes.constant.js';

export function ChatHeader({
  meta,
  chat,
  typingUsers = [],
  onTitleClick,
  backTo,
}) {
  const navigate = useNavigate();

  function handleTitleClick() {
    if (!meta.headerClickable) return;
    if (onTitleClick) return onTitleClick();
    if (meta.isGroup && chat?.id) {
      navigate(ROUTES.GROUP_INFO(chat.id));
    }
  }

  return (
    <div className="flex items-center gap-3 border-b border-wa-border bg-wa-dark px-3 py-2 text-white">
      <button
        type="button"
        onClick={() => navigate(backTo || ROUTES.CHATS)}
        className="rounded p-1 hover:bg-white/10"
        aria-label="Back"
      >
        {'<'}
      </button>
      <button
        type="button"
        onClick={handleTitleClick}
        className={`flex flex-1 items-center gap-3 text-left ${
          meta.headerClickable ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        <Avatar name={meta.avatarSeed} size={40} online={meta.online} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{meta.title}</div>
          {typingUsers.length > 0 ? (
            <TypingIndicator users={typingUsers} />
          ) : (
            <div className="truncate text-xs text-white/70">{meta.subtitle}</div>
          )}
        </div>
      </button>
    </div>
  );
}
