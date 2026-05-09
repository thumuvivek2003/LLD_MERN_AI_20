import Badge from '../../../shared/components/ui/Badge.jsx';
import Button from '../../../shared/components/ui/Button.jsx';
import { formatCurrency } from '../../../shared/utils/currencyFormatter.js';

export default function FineCard({ fine, onPay }) {
  return (
    <div className="fine-card">
      <span>Amount: <strong>{formatCurrency(fine.amount)}</strong></span>
      <Badge label={fine.status} variant={fine.status === 'PAID' ? 'success' : 'warning'} />
      {fine.status === 'PENDING' && (
        <Button onClick={() => onPay(fine._id)} variant="primary">Pay Fine</Button>
      )}
    </div>
  );
}
