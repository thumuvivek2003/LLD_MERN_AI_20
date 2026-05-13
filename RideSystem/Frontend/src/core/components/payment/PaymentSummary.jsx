import { formatCurrency } from '../../utils/formatCurrency.js';

export default function PaymentSummary({ ride }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 space-y-1.5 text-sm">
      <div className="flex justify-between"><span>Base fare</span><span>{formatCurrency(30)}</span></div>
      <div className="flex justify-between"><span>Distance ({ride?.distanceKm?.toFixed?.(1)} km)</span><span>{formatCurrency((ride?.fare || 0) - 30)}</span></div>
      <hr className="border-slate-200 my-1" />
      <div className="flex justify-between font-bold text-base"><span>Total</span><span>{formatCurrency(ride?.fare)}</span></div>
    </div>
  );
}
