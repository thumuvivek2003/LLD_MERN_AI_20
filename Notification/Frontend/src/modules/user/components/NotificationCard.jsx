import { StatusPill } from '../../../shared/components/StatusPill.jsx';
import { CHANNELS } from '../../../shared/constants/notification.constants.js';
import { formatDate } from '../../../shared/utils/formatDate.js';

export function NotificationCard({ notification }) {
  const channel =
    CHANNELS.find((c) => c.key === notification.channel) || CHANNELS[0];
  const { renderedPreview, eventType, status, createdAt } = notification;
  const subject = renderedPreview?.subject || eventType;
  const body = renderedPreview?.body || '';

  return (
    <div className="card p-4 flex items-start gap-3 hover:shadow-soft transition-shadow">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium border ${channel.color}`}
      >
        {channel.label[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-slate-900 truncate">
            {subject}
          </h4>
          <StatusPill status={status} />
        </div>
        {body && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{body}</p>
        )}
        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
          <span className={`pill ${channel.color}`}>{channel.label}</span>
          <span>{eventType}</span>
          <span>·</span>
          <span>{formatDate(createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
