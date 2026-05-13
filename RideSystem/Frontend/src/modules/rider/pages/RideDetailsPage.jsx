import { useParams } from 'react-router-dom';
import Card from '../../../core/components/ui/Card.jsx';
import RouteMap from '../../../core/components/map/RouteMap.jsx';
import RideStatusBadge from '../../../core/components/ride/RideStatusBadge.jsx';
import { useRideTracking } from '../hooks/useRideTracking.js';
import { formatCurrency } from '../../../core/utils/formatCurrency.js';
import { formatDate } from '../../../core/utils/formatDate.js';

export default function RideDetailsPage() {
  const { rideId } = useParams();
  const { ride } = useRideTracking(rideId);
  if (!ride) return null;

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <p className="font-semibold">Ride Details</p>
          <RideStatusBadge status={ride.status} />
        </div>
        <p className="text-xs text-slate-500 mt-1">{formatDate(ride.createdAt)}</p>
      </Card>
      <RouteMap pickup={ride.pickup} drop={ride.drop} />
      <Card>
        <p className="text-xs text-slate-500">Pickup</p>
        <p className="font-medium">{ride.pickup?.address}</p>
        <p className="text-xs text-slate-500 mt-2">Drop</p>
        <p className="font-medium">{ride.drop?.address}</p>
      </Card>
      <Card>
        <div className="flex justify-between"><span>Fare</span><span className="font-bold">{formatCurrency(ride.fare)}</span></div>
        <div className="flex justify-between mt-1 text-sm text-slate-500"><span>Distance</span><span>{ride.distanceKm?.toFixed?.(1)} km</span></div>
        <div className="flex justify-between mt-1 text-sm text-slate-500"><span>Payment</span><span>{ride.paymentStatus}</span></div>
      </Card>
    </div>
  );
}
