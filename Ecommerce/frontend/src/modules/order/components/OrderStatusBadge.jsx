import { ORDER_STATUS_STYLES } from '../../../shared/constants/orderStatus.constants.js';

export default function OrderStatusBadge({ status }) {
  const cls = ORDER_STATUS_STYLES[status] || 'bg-slate-100 text-slate-700';
  return <span className={`chip ${cls}`}>{status}</span>;
}
