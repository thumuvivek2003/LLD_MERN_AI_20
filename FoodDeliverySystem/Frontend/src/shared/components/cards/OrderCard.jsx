import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../core/utils/currency.util.js';
import { formatDate } from '../../../core/utils/date.util.js';
import { StatusBadge } from '../ui/Badge.jsx';

export const OrderCard = ({ order, linkPrefix = '/customer/orders', actions }) => (
  <div className="card p-4">
    <div className="flex justify-between items-start mb-2">
      <div>
        <Link to={`${linkPrefix}/${order.id}`} className="font-semibold hover:text-brand">
          Order #{order.id.slice(-6)}
        </Link>
        <div className="text-xs text-gray-500 mt-0.5">{formatDate(order.createdAt)}</div>
      </div>
      <StatusBadge status={order.status} />
    </div>
    <div className="text-sm text-gray-600">
      {order.items.length} item{order.items.length !== 1 ? 's' : ''} ·{' '}
      <span className="font-medium text-gray-900">{formatCurrency(order.totalAmount)}</span>
    </div>
    <div className="text-xs text-gray-500 mt-1">📍 {order.deliveryAddress}</div>
    {actions && <div className="mt-3 flex gap-2 flex-wrap">{actions}</div>}
  </div>
);
