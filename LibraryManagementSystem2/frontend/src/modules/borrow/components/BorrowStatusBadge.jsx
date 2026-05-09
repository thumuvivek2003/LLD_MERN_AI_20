import Badge from '../../../shared/components/ui/Badge.jsx';

const variantMap = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
  RETURNED: 'info',
  OVERDUE: 'danger',
};

export default function BorrowStatusBadge({ status }) {
  return <Badge label={status} variant={variantMap[status] || 'default'} />;
}
