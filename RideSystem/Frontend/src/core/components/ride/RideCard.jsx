import RideStatusBadge from './RideStatusBadge.jsx';
import { formatDate } from '../../utils/formatDate.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function RideCard({ ride, onClick }) {
  return (
    <button onClick={onClick} className="w-full text-left card hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500">{formatDate(ride.createdAt)}</p>
          <p className="text-sm font-semibold truncate mt-0.5">
            {ride.pickup?.address || `${ride.pickup?.lat?.toFixed(3)}, ${ride.pickup?.lng?.toFixed(3)}`}
          </p>
          <p className="text-sm text-slate-500 truncate">
            → {ride.drop?.address || `${ride.drop?.lat?.toFixed(3)}, ${ride.drop?.lng?.toFixed(3)}`}
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold">{formatCurrency(ride.fare)}</p>
          <div className="mt-1"><RideStatusBadge status={ride.status} /></div>
        </div>
      </div>
    </button>
  );
}
