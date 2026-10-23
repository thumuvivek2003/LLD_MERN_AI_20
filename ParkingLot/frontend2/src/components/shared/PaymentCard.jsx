import { Card } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';
import { StatusTone } from '../../constants/statuses.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

export function PaymentCard({ payment }) {
  if (!payment) return null;
  const status = payment.status || 'PENDING';
  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-500">Amount</p>
          <p className="text-2xl font-semibold text-ink-900">
            {formatCurrency(payment.amount)}
          </p>
        </div>
        <Badge tone={StatusTone[status] || 'neutral'}>{status}</Badge>
      </div>
      <div className="flex justify-between text-xs text-ink-500">
        <span>{payment.method || 'CASH'}</span>
        <span>{formatDate(payment.paidAt || payment.createdAt)}</span>
      </div>
    </Card>
  );
}
