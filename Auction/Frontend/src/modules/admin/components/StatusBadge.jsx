import { AUCTION_STATUS } from '../../shared/constants/socketEvents.constant.js';

const CLASS_BY_STATUS = {
  [AUCTION_STATUS.OPEN]: 'badge-open',
  [AUCTION_STATUS.SCHEDULED]: 'badge-scheduled',
  [AUCTION_STATUS.CLOSED]: 'badge-closed',
  [AUCTION_STATUS.CANCELLED]: 'badge-cancelled',
};

export default function StatusBadge({ status }) {
  const cls = CLASS_BY_STATUS[status] || 'badge-closed';
  return <span className={cls}>{status}</span>;
}
