import MailCard from './MailCard.jsx';
import EmptyState from '../../../shared/components/EmptyState.jsx';
import { MailSkeleton } from '../../../shared/components/Loader.jsx';
import { InboxIcon, SendIcon } from '../../../shared/components/Icons.jsx';

export default function MailList({
  mails,
  box = 'inbox',
  loading,
  error,
  onRetry,
  emptyTitle,
  emptyDescription,
}) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <MailSkeleton rows={7} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <EmptyState
          title="Couldn't load mail"
          description={error}
          action={
            onRetry && (
              <button
                onClick={onRetry}
                className="rounded-lg bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100"
              >
                Retry
              </button>
            )
          }
        />
      </div>
    );
  }

  if (!mails || mails.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-card">
        <EmptyState
          icon={box === 'sent' ? SendIcon : InboxIcon}
          title={emptyTitle || (box === 'sent' ? 'No sent mail' : 'Inbox zero')}
          description={
            emptyDescription ||
            (box === 'sent'
              ? 'Messages you send will show up here.'
              : 'New emails will appear here in real time.')
          }
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="divide-y divide-slate-100">
        {mails.map((m) => (
          <MailCard key={m.id} mail={m} box={box} />
        ))}
      </div>
    </div>
  );
}
