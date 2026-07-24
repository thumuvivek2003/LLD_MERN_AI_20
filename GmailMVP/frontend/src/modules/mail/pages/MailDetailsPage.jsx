import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../../shared/context/UserContext.jsx';
import { useToast } from '../../../shared/context/ToastContext.jsx';
import { MailService } from '../../../shared/services/MailService.js';
import MailHeader from '../components/MailHeader.jsx';
import MailBody from '../components/MailBody.jsx';
import ReplyEditor from '../components/ReplyEditor.jsx';
import Button from '../../../shared/components/Button.jsx';
import { Loader } from '../../../shared/components/Loader.jsx';
import EmptyState from '../../../shared/components/EmptyState.jsx';
import {
  BackIcon,
  ReplyIcon,
  ReplyAllIcon,
  ForwardIcon,
  StarIcon,
  ArchiveIcon,
  TrashIcon,
  ChatIcon,
} from '../../../shared/components/Icons.jsx';

export default function MailDetailsPage() {
  const { id } = useParams();
  const { currentUser } = useUser();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const [mail, setMail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [starred, setStarred] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    setError(null);
    try {
      // Opening marks the mail READ for this user (per contract).
      const data = await MailService.open(id, currentUser.id);
      setMail(data);
    } catch (e) {
      setError(e.message || 'Failed to open mail');
    } finally {
      setLoading(false);
    }
  }, [id, currentUser?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleReply = async (body) => {
    setSending(true);
    try {
      await MailService.reply(id, { senderId: currentUser.id, body });
      pushToast({ variant: 'success', title: 'Reply sent' });
      setReplyOpen(false);
      if (mail?.threadId) navigate(`/thread/${mail.threadId}`);
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

  if (loading) return <Loader label="Opening email…" />;

  if (error || !mail) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-card">
        <EmptyState
          title="Email not found"
          description={error || 'This message may have been removed.'}
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
      {/* Toolbar */}
      <div className="mb-4 flex items-center gap-1">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
        >
          <BackIcon size={20} />
        </button>
        <div className="ml-auto flex items-center gap-1 text-slate-400">
          <button
            onClick={() => setStarred((s) => !s)}
            className={`rounded-lg p-2 transition hover:bg-slate-100 ${
              starred ? 'text-amber-400' : ''
            }`}
            title="Star"
          >
            <StarIcon size={20} filled={starred} />
          </button>
          <button className="rounded-lg p-2 transition hover:bg-slate-100" title="Archive">
            <ArchiveIcon size={20} />
          </button>
          <button className="rounded-lg p-2 transition hover:bg-slate-100" title="Delete">
            <TrashIcon size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            {mail.subject}
          </h1>
          {mail.threadId && (
            <Link
              to={`/thread/${mail.threadId}`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
            >
              <ChatIcon size={15} /> View thread
            </Link>
          )}
        </div>

        <MailHeader mail={mail} />
        <MailBody body={mail.body} />

        {/* Reply actions */}
        <div className="border-t border-slate-100 px-6 py-4">
          {replyOpen ? (
            <ReplyEditor
              currentUser={currentUser}
              replyingTo={mail.sender?.name}
              onSubmit={handleReply}
              onCancel={() => setReplyOpen(false)}
              sending={sending}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={ReplyIcon}
                onClick={() => setReplyOpen(true)}
              >
                Reply
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={ReplyAllIcon}
                onClick={() => setReplyOpen(true)}
              >
                Reply all
              </Button>
              <Button variant="ghost" size="sm" leftIcon={ForwardIcon}>
                Forward
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
