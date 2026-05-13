import { formatCurrency } from '../../utils/formatCurrency.js';
import Card from '../ui/Card.jsx';

export default function RideFareCard({ ride }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <span className="text-slate-500 text-sm">Estimated fare</span>
        <span className="text-2xl font-bold">{formatCurrency(ride?.fare)}</span>
      </div>
      <div className="flex items-center justify-between mt-2 text-sm text-slate-500">
        <span>Distance</span>
        <span>{ride?.distanceKm?.toFixed?.(1) ?? ride?.distanceKm} km</span>
      </div>
    </Card>
  );
}
