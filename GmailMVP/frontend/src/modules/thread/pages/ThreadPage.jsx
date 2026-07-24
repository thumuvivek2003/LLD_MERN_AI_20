import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../../shared/context/UserContext.jsx';
import { useToast } from '../../../shared/context/ToastContext.jsx';
import { ThreadService } from '../../../shared/services/ThreadService.js';
import { MailService } from '../../../shared/services/MailService.js';
import ConversationTimeline from '../components/ConversationTimeline.jsx';
import ReplyEditor from '../../mail/components/ReplyEditor.jsx';
import Button from '../../../shared/components/Button.jsx';
import Avatar from '../../../shared/components/Avatar.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';
import EmptyState from '../../../shared/components/EmptyState.jsx';
import {
  BackIcon,
  ReplyAllIcon,
  ChatIcon,
} from '../../../shared/components/Icons.jsx';

export default function ThreadPage() {
  const { id } = useParams();
  const { currentUser } = useUser();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setThread(await ThreadService.get(id));
    } catch (e) {
      setError(e.message || 'Failed to load thread');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleReply = async (body) => {
    const last = thread?.mails?.[thread.mails.length - 1];
    if (!last) return;
    setSending(true);
    try {
      await MailService.reply(last.id, { senderId: currentUser.id, body });
      pushToast({ variant: 'success', title: 'Reply sent' });
      setReplyOpen(false);
      await load();
    } catch (e) {
      pushToast({
        variant: 'error',
        title: 'Failed to reply',
        message: e.message,
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loader label="Loading conversation…" />;

  if (error || !thread) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-card">
        <EmptyState
          icon={ChatIcon}
          title="Conversation not found"
          description={error || 'This thread may have been removed.'}
          action={
            <Button variant="secondary" onClick={() => navigate('/inbox')}>
              Back to inbox
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-1">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
        >
          <BackIcon size={20} />
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <div className="border-b border-slate-100 px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            {thread.subject}
          </h1>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-xs text-slate-400">
              {thread.mails.length} message
              {thread.mails.length === 1 ? '' : 's'}
            </span>
            <div className="flex -space-x-2">
              {thread.participants.map((p) => (
                <Avatar
                  key={p.id}
                  name={p.name}
                  color={p.color}
                  size="xs"
                  ring
                />
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <ConversationTimeline
            mails={thread.mails}
            currentUserId={currentUser?.id}
          />
        </div>

        <div className="border-t border-slate-100 px-6 py-4">
          {replyOpen ? (
            <ReplyEditor
              currentUser={currentUser}
              onSubmit={handleReply}
              onCancel={() => setReplyOpen(false)}
              sending={sending}
            />
          ) : (
            <button
              onClick={() => setReplyOpen(true)}
              className="flex w-full items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-left text-sm text-slate-400 transition hover:border-brand-200 hover:bg-brand-50/40"
            >
              <ReplyAllIcon size={18} />
              Reply to all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
