import { useNavigate } from 'react-router-dom';
import Avatar from '../../../shared/components/Avatar.jsx';

/**
 * A single row in a mail list. Presentation (bold vs normal, unread dot) is
 * driven by the view model's State-pattern object.
 * @param {'inbox'|'sent'} box
 */
export default function MailCard({ mail, box = 'inbox' }) {
  const navigate = useNavigate();
  const person = box === 'sent' ? null : mail.sender;
  const primaryName =
    box === 'sent'
      ? mail.receiverNames
        ? `To: ${mail.receiverNames}`
        : 'To: —'
      : mail.sender?.name;

  const avatarPerson = box === 'sent' ? mail.receivers?.[0] : mail.sender;

  return (
    <div
      onClick={() => navigate(`/mail/${mail.id}`)}
      className={`group flex cursor-pointer items-center gap-4 px-5 py-3.5 transition-colors ${
        mail.showUnreadDot ? 'bg-white' : 'bg-white'
      } hover:bg-brand-50/40`}
    >
      <Avatar
        name={avatarPerson?.name || primaryName}
        color={avatarPerson?.color || avatarPerson?.avatarColor || '#6366f1'}
        size="md"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className={`truncate text-sm ${mail.emphasisClass}`}>
            {primaryName}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            {mail.showUnreadDot && (
              <span className="h-2 w-2 rounded-full bg-brand-500" />
            )}
            <span
              className={`text-xs ${
                mail.showUnreadDot
                  ? 'font-semibold text-brand-600'
                  : 'text-slate-400'
              }`}
            >
              {mail.shortTime}
            </span>
          </div>
        </div>
        <p className={`truncate text-sm ${mail.subjectClass}`}>{mail.subject}</p>
        <p className="truncate text-xs text-slate-400">{mail.snippet}</p>
      </div>
    </div>
  );
}
