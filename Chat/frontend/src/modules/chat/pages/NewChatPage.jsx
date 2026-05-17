import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../../user/hooks/useUsers.js';
import { useUserStore } from '../../user/store/user.store.js';
import { useChatStore } from '../store/chat.store.js';
import { createDirectChat } from '../services/chat.service.js';
import { UserCard } from '../../user/components/UserCard.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { Input } from '../../../shared/components/Input.jsx';
import { ROUTES } from '../../../shared/constants/routes.constant.js';

export function NewChatPage() {
  const navigate = useNavigate();
  const { users, loading } = useUsers();
  const onlineIds = useUserStore((s) => s.onlineIds);
  const lastSeenMap = useUserStore((s) => s.lastSeenMap);
  const upsertChat = useChatStore((s) => s.upsertChat);

  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);

  const filtered = users.filter((u) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      (u.mobile || '').includes(q.replace(/\D/g, ''))
    );
  });

  async function handlePick(user) {
    setCreating(true);
    try {
      const chat = await createDirectChat(user.id);
      upsertChat(chat);
      navigate(ROUTES.CHAT_DETAIL(chat.id));
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-wa-border bg-wa-light px-4 py-3 text-xs font-semibold uppercase tracking-wide text-wa-muted">
        New chat
      </div>
      <div className="border-b border-wa-border p-3">
        <Input
          placeholder="Search by name or mobile"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="scrollbar-thin flex-1 overflow-y-auto">
        {loading && filtered.length === 0 ? <Loader /> : null}
        {!loading && filtered.length === 0 ? (
          <EmptyState title="No matches" />
        ) : null}
        {filtered.map((u) => (
          <UserCard
            key={u.id}
            user={u}
            online={onlineIds.has(u.id) || u.isOnline}
            lastSeen={lastSeenMap[u.id] || u.lastSeen}
            onClick={() => !creating && handlePick(u)}
          />
        ))}
      </div>
    </div>
  );
}
