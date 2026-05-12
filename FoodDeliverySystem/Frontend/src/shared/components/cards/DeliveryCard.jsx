import { formatCurrency } from '../../../core/utils/currency.util.js';
import { StatusBadge } from '../ui/Badge.jsx';

export const DeliveryCard = ({ order, actions }) => (
  <div className="card p-4">
    <div className="flex justify-between items-start mb-2">
      <div className="font-semibold">Order #{order.id.slice(-6)}</div>
      <StatusBadge status={order.status} />
    </div>
    <div className="text-sm text-gray-700">📦 {order.items.length} items · {formatCurrency(order.totalAmount)}</div>
    <div className="text-xs text-gray-500 mt-1">🏠 {order.deliveryAddress}</div>
    {actions && <div className="mt-3 flex gap-2 flex-wrap">{actions}</div>}
  </div>
);
