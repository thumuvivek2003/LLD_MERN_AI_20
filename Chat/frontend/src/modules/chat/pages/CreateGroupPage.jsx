import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateGroupForm } from '../components/CreateGroupForm.jsx';
import { useUsers } from '../../user/hooks/useUsers.js';
import { useChatStore } from '../store/chat.store.js';
import { createGroupChat } from '../services/chat.service.js';
import { ROUTES } from '../../../shared/constants/routes.constant.js';

export function CreateGroupPage() {
  const navigate = useNavigate();
  const { users } = useUsers();
  const upsertChat = useChatStore((s) => s.upsertChat);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit({ name, memberIds }) {
    setLoading(true);
    setError(null);
    try {
      const chat = await createGroupChat({ name, memberIds });
      upsertChat(chat);
      navigate(ROUTES.CHAT_DETAIL(chat.id));
    } catch (err) {
      setError(err.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="border-b border-wa-border bg-wa-light px-4 py-3 text-xs font-semibold uppercase tracking-wide text-wa-muted">
        New group
      </div>
      <div className="p-4">
        {error ? (
          <div className="mb-3 text-xs text-red-500">{error}</div>
        ) : null}
        <CreateGroupForm
          users={users}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}
