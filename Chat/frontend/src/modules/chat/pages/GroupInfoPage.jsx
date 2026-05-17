import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useChatStore } from '../store/chat.store.js';
import { useAuthStore } from '../../auth/store/auth.store.js';
import { useUsers } from '../../user/hooks/useUsers.js';
import { useGroup } from '../hooks/useGroup.js';
import { GroupMemberList } from '../components/GroupMemberList.jsx';
import { AddMemberModal } from '../components/AddMemberModal.jsx';
import { Avatar } from '../../../shared/components/Avatar.jsx';
import { Button } from '../../../shared/components/Button.jsx';
import { Input } from '../../../shared/components/Input.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';
import { fetchChatById } from '../services/chat.service.js';
import { ROUTES } from '../../../shared/constants/routes.constant.js';

export function GroupInfoPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const chat = useChatStore((s) => s.getChatById(chatId));
  const upsertChat = useChatStore((s) => s.upsertChat);
  const currentUser = useAuthStore((s) => s.user);
  const { users } = useUsers();

  const [name, setName] = useState(chat?.name || '');
  const [adding, setAdding] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  const { addMembers, removeMember, rename, loading } = useGroup(chatId);

  useEffect(() => {
    if (!chat) {
      fetchChatById(chatId)
        .then((data) => data && upsertChat(data))
        .catch(() => {});
    } else {
      setName(chat.name || '');
    }
  }, [chat, chatId, upsertChat]);

  if (!chat) return <Loader label="Loading group" />;

  const me = (chat.members || []).find((m) => m.userId === currentUser?.id);
  const isAdmin = me?.role === 'ADMIN';
  const existingIds = (chat.members || []).map((m) => m.userId);

  async function handleRename(e) {
    e.preventDefault();
    setSaveMsg(null);
    if (!name.trim() || name === chat.name) return;
    try {
      await rename(name.trim());
      setSaveMsg({ type: 'ok', text: 'Group renamed' });
    } catch (err) {
      setSaveMsg({ type: 'err', text: err.message || 'Rename failed' });
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="flex items-center gap-3 border-b border-wa-border bg-wa-dark px-3 py-2 text-white">
        <button
          type="button"
          onClick={() => navigate(ROUTES.CHAT_DETAIL(chatId))}
          className="rounded p-1 hover:bg-white/10"
        >
          {'<'}
        </button>
        <div className="text-sm font-semibold">Group info</div>
      </div>

      <div className="flex flex-col items-center gap-3 border-b border-wa-border bg-wa-light p-6">
        <Avatar name={chat.name} size={72} />
        <div className="text-lg font-semibold text-wa-dark">{chat.name}</div>
        <div className="text-xs text-wa-muted">
          {chat.members?.length || 0} members
        </div>
      </div>

      {isAdmin ? (
        <form
          onSubmit={handleRename}
          className="flex items-end gap-3 border-b border-wa-border p-4"
        >
          <div className="flex-1">
            <Input
              label="Rename group"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {saveMsg ? (
              <div
                className={`mt-1 text-xs ${
                  saveMsg.type === 'ok' ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                {saveMsg.text}
              </div>
            ) : null}
          </div>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !name.trim() || name === chat.name}
          >
            Save
          </Button>
        </form>
      ) : null}

      <div className="flex items-center justify-between px-4 py-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-wa-muted">
          Members
        </div>
        {isAdmin ? (
          <Button size="sm" onClick={() => setAdding(true)}>
            Add member
          </Button>
        ) : null}
      </div>

      <GroupMemberList
        members={chat.members || []}
        currentUserId={currentUser?.id}
        isCurrentUserAdmin={isAdmin}
        onRemove={(uid) => removeMember(uid)}
      />

      <AddMemberModal
        open={adding}
        onClose={() => setAdding(false)}
        candidates={users}
        existingIds={existingIds}
        loading={loading}
        onAdd={(ids) => addMembers(ids)}
      />
    </div>
  );
}
