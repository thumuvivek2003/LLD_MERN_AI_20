import { ORDER_STATUS_COLOR, ORDER_STATUS_LABEL } from '../../../core/constants/order-status.constants.js';

export const Badge = ({ children, color = 'bg-gray-100 text-gray-700' }) => (
  <span className={`badge ${color}`}>{children}</span>
);

export const StatusBadge = ({ status }) => (
  <Badge color={ORDER_STATUS_COLOR[status] || 'bg-gray-100 text-gray-700'}>
    {ORDER_STATUS_LABEL[status] || status}
  </Badge>
);
