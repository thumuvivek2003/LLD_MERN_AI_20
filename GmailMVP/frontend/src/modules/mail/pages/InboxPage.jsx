import { useMail } from '../hooks/useMail.js';
import MailList from '../components/MailList.jsx';

export default function InboxPage() {
  const { mails, loading, error, reload, unreadCount } = useMail('inbox');

  return (
    <div>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
            Inbox
          </h1>
          <p className="mt-0.5 text-sm text-slate-400">
            View all received emails
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            {unreadCount} unread
          </span>
        )}
      </div>

      <MailList
        mails={mails}
        box="inbox"
        loading={loading}
        error={error}
        onRetry={reload}
      />
    </div>
  );
}
