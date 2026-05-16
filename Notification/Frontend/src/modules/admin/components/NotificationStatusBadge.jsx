import { StatusPill } from '../../../shared/components/StatusPill.jsx';

// Thin alias so admin module can theme/extend pill independently if needed.
export function NotificationStatusBadge({ status }) {
  return <StatusPill status={status} />;
}
