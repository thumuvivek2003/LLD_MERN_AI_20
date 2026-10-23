import { Card } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

export const PaymentCard = ({ payment }) => {
  if (!payment) return null;
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase text-slate-500">Payment</div>
          <div className="text-2xl font-semibold text-slate-900">{formatCurrency(payment.amount)}</div>
        </div>
        <Badge tone={payment.status === 'PAID' ? 'success' : 'warning'}>{payment.status}</Badge>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-600">
        <div>Method: <span className="text-slate-800">{payment.method || '-'}</span></div>
        <div>At: <span className="text-slate-800">{formatDate(payment.paidAt)}</span></div>
      </div>
    </Card>
  );
};
