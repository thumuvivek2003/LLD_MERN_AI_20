import { useNavigate } from 'react-router-dom';
import { useUsers } from '../hooks/useUsers.js';
import { useUserStore } from '../store/user.store.js';
import { UserCard } from '../components/UserCard.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { createDirectChat } from '../../chat/services/chat.service.js';
import { useChatStore } from '../../chat/store/chat.store.js';
import { ROUTES } from '../../../shared/constants/routes.constant.js';

export function ContactsPage() {
  const navigate = useNavigate();
  const { users, loading } = useUsers();
  const onlineIds = useUserStore((s) => s.onlineIds);
  const lastSeenMap = useUserStore((s) => s.lastSeenMap);
  const upsertChat = useChatStore((s) => s.upsertChat);

  async function handlePick(user) {
    try {
      const chat = await createDirectChat(user.id);
      upsertChat(chat);
      navigate(ROUTES.CHAT_DETAIL(chat.id));
    } catch (err) {
      console.error(err);
    }
  }

  if (loading && users.length === 0) return <Loader label="Loading contacts" />;
  if (!loading && users.length === 0) {
    return (
      <EmptyState
        title="No contacts yet"
        subtitle="Once other users sign up they will show up here."
      />
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="border-b border-wa-border bg-wa-light px-4 py-3 text-xs font-semibold uppercase tracking-wide text-wa-muted">
        Contacts ({users.length})
      </div>
      {users.map((u) => (
        <UserCard
          key={u.id}
          user={u}
          online={onlineIds.has(u.id) || u.isOnline}
          lastSeen={lastSeenMap[u.id] || u.lastSeen}
          onClick={() => handlePick(u)}
        />
      ))}
    </div>
  );
}
