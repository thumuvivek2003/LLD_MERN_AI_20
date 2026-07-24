import { useMail } from '../hooks/useMail.js';
import MailList from '../components/MailList.jsx';

export default function SentPage() {
  const { mails, loading, error, reload } = useMail('sent');

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
          Sent
        </h1>
        <p className="mt-0.5 text-sm text-slate-400">View all sent emails</p>
      </div>

      <MailList
        mails={mails}
        box="sent"
        loading={loading}
        error={error}
        onRetry={reload}
      />
    </div>
  );
}
