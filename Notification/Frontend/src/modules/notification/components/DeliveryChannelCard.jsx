import { NotificationPreviewCard } from '../../user/components/NotificationPreviewCard.jsx';
import { CHANNELS } from '../../../shared/constants/notification.constants.js';

// Strategy-on-frontend: picks the right preview for the chosen channel.
export function DeliveryChannelCard({ channel, subject, body }) {
  const meta = CHANNELS.find((c) => c.key === channel);
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className={`pill ${meta?.color || ''}`}>{meta?.label || channel}</span>
      </div>
      <NotificationPreviewCard
        channel={channel}
        subject={subject}
        body={body}
      />
    </div>
  );
}
