import { Link } from 'react-router-dom';
import { MessageStatusIcon } from './MessageStatusIcon.jsx';
import { formatTime } from '../../../shared/utils/format-date.util.js';
import { ROUTES } from '../../../shared/constants/routes.constant.js';

export function MessageBubble({ message, isMine, showSender = false }) {
  const wrap = isMine ? 'justify-end' : 'justify-start';
  const bubble = isMine
    ? 'bg-wa-sent text-wa-dark rounded-tr-sm'
    : 'bg-wa-received text-wa-dark rounded-tl-sm';
  return (
    <div className={`flex w-full ${wrap}`}>
      <div
        className={`max-w-[78%] rounded-lg px-3 py-2 shadow-sm ${bubble}`}
      >
        {showSender && !isMine ? (
          <div className="mb-0.5 text-xs font-semibold text-emerald-700">
            {message.senderName || 'User'}
          </div>
        ) : null}
        <div className="whitespace-pre-wrap break-words text-sm">
          {message.content}
        </div>
        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-wa-muted">
          <span>{formatTime(message.createdAt)}</span>
          {isMine && message.id ? (
            <Link
              to={ROUTES.MESSAGE_STATUS(message.id)}
              title="View delivery status"
              className="inline-flex"
            >
              <MessageStatusIcon status={message.status} />
            </Link>
          ) : isMine ? (
            <MessageStatusIcon status={message.status} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
