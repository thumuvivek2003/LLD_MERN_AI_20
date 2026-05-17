import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMessageStore } from '../store/message.store.js';
import { useChatStore } from '../store/chat.store.js';
import { Avatar } from '../../../shared/components/Avatar.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { formatDate } from '../../../shared/utils/format-date.util.js';
import { ROUTES } from '../../../shared/constants/routes.constant.js';
import { MESSAGE_STATUS } from '../../../shared/constants/socket.constant.js';
import { fetchMessages } from '../services/message.service.js';

const RANK = {
  [MESSAGE_STATUS.SENT]: 1,
  [MESSAGE_STATUS.DELIVERED]: 2,
  [MESSAGE_STATUS.READ]: 3,
};

export function MessageStatusPage() {
  const { messageId } = useParams();
  const navigate = useNavigate();
  const byChat = useMessageStore((s) => s.byChat);
  const chats = useChatStore((s) => s.chats);

  const cached = useMemo(() => {
    for (const list of Object.values(byChat)) {
      const m = list.find((x) => x.id === messageId);
      if (m) return m;
    }
    return null;
  }, [byChat, messageId]);

  const [message, setMessage] = useState(cached);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    setMessage(cached);
  }, [cached]);

  // Fallback: try to find which chat the message belongs to via cache; if
  // not found, ask each chat (cheap MVP fallback — limited to first few).
  useEffect(() => {
    if (message) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function findIt() {
      setLoading(true);
      for (const c of chats.slice(0, 25)) {
        try {
          const data = await fetchMessages(c.id, { limit: 50 });
          const hit = (data || []).find((m) => m.id === messageId);
          if (hit) {
            if (!cancelled) {
              setMessage(hit);
              setLoading(false);
            }
            return;
          }
        } catch (_err) {
          // ignore and continue
        }
      }
      if (!cancelled) setLoading(false);
    }
    findIt();
    return () => {
      cancelled = true;
    };
  }, [chats, messageId, message]);

  if (loading) return <Loader label="Loading message status" />;
  if (!message) {
    return (
      <EmptyState
        title="Message not found"
        subtitle="It may have been deleted or you don't have access."
      />
    );
  }

  const sorted = [...(message.statuses || [])].sort(
    (a, b) => (RANK[b.status] || 0) - (RANK[a.status] || 0)
  );

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="flex items-center gap-3 border-b border-wa-border bg-wa-dark px-3 py-2 text-white">
        <button
          type="button"
          onClick={() =>
            message.chatId
              ? navigate(ROUTES.CHAT_DETAIL(message.chatId))
              : navigate(ROUTES.CHATS)
          }
          className="rounded p-1 hover:bg-white/10"
        >
          {'<'}
        </button>
        <div className="text-sm font-semibold">Message info</div>
      </div>

      <div className="border-b border-wa-border p-4">
        <div className="text-xs text-wa-muted">Sent at</div>
        <div className="text-sm">{formatDate(message.createdAt)}</div>
        <div className="mt-3 rounded-lg bg-wa-sent p-3 text-sm text-wa-dark">
          {message.content}
        </div>
      </div>

      <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-wa-muted">
        Recipients ({sorted.length})
      </div>
      <div className="divide-y divide-wa-border">
        {sorted.length === 0 ? (
          <div className="px-4 py-6 text-sm text-wa-muted">
            No recipient status yet.
          </div>
        ) : (
          sorted.map((s) => (
            <div key={s.userId} className="flex items-center gap-3 px-4 py-3">
              <Avatar name={s.name || '?'} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-wa-dark">
                  {s.name || s.userId}
                </div>
                <div className="text-xs text-wa-muted">
                  {formatDate(s.timestamp)}
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  s.status === MESSAGE_STATUS.READ
                    ? 'bg-sky-50 text-sky-600'
                    : s.status === MESSAGE_STATUS.DELIVERED
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-wa-light text-wa-muted'
                }`}
              >
                {s.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
