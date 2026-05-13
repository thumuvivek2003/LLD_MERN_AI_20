import RideStatusBadge from './RideStatusBadge.jsx';
import Badge from '../ui/Badge.jsx';
import { formatDate } from '../../utils/formatDate.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { RIDE_STATUS } from '../../constants/ride.constants.js';
import { PAYMENT_STATUS } from '../../constants/payment.constants.js';

export default function RideCard({ ride, onClick }) {
  const isUnpaid =
    ride.status === RIDE_STATUS.COMPLETED &&
    ride.paymentStatus === PAYMENT_STATUS.PENDING;

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
          <div className="mt-1">
            {isUnpaid
              ? <Badge tone="danger">Pay {formatCurrency(ride.fare)}</Badge>
              : <RideStatusBadge status={ride.status} />}
          </div>
        </div>
      </div>
    </button>
  );
}
