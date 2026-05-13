import Card from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { formatCurrency } from '../../../core/utils/formatCurrency.js';

export default function RideRequestCard({ ride, onAccept, busy }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500">New ride request</p>
          <p className="font-semibold text-lg mt-0.5">{formatCurrency(ride.fare)}</p>
        </div>
        <span className="chip bg-emerald-100 text-emerald-700">{ride.distanceKm?.toFixed?.(1)} km</span>
      </div>
      <div className="mt-3 space-y-1.5 text-sm">
        <div className="flex gap-2"><span className="text-emerald-500">●</span><span className="text-slate-600 truncate">{ride.pickup?.address}</span></div>
        <div className="flex gap-2"><span className="text-red-500">●</span><span className="text-slate-600 truncate">{ride.drop?.address}</span></div>
      </div>
      <Button className="w-full mt-3" disabled={busy} onClick={() => onAccept(ride)}>Accept</Button>
    </Card>
  );
}
