import Card from '../../../core/components/ui/Card.jsx';
import { formatCurrency } from '../../../core/utils/formatCurrency.js';

export default function DriverEarningsCard({ total = 0, count = 0 }) {
  return (
    <Card>
      <p className="text-xs text-slate-500">Total earnings</p>
      <p className="text-3xl font-bold mt-1">{formatCurrency(total)}</p>
      <p className="text-xs text-slate-500 mt-1">{count} completed trips</p>
    </Card>
  );
}
