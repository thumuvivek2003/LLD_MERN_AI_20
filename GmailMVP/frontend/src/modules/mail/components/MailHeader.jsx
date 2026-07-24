import Avatar from '../../../shared/components/Avatar.jsx';

/**
 * The header block inside an open email: sender identity + timestamp + recipients.
 */
export default function MailHeader({ mail }) {
  return (
    <div className="flex items-start gap-4 px-6 py-5">
      <Avatar
        name={mail.sender?.name}
        color={mail.sender?.color}
        size="lg"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <p className="text-sm font-semibold text-slate-800">
            {mail.sender?.name}
            <span className="ml-2 font-normal text-slate-400">
              &lt;{mail.sender?.email}&gt;
            </span>
          </p>
          <span className="text-xs text-slate-400">{mail.fullTime}</span>
        </div>
        <p className="mt-0.5 text-xs text-slate-400">
          to {mail.receiverNames || '—'}
        </p>
      </div>
    </div>
  );
}
