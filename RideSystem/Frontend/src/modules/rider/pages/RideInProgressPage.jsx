import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LiveTrackingMap from '../../../core/components/map/LiveTrackingMap.jsx';
import Card from '../../../core/components/ui/Card.jsx';
import { useRideTracking } from '../hooks/useRideTracking.js';
import { formatCurrency } from '../../../core/utils/formatCurrency.js';

export default function RideInProgressPage() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { ride, driverPos } = useRideTracking(rideId);

  useEffect(() => {
    if (ride?.status === 'COMPLETED') navigate(`/rider/completed/${rideId}`);
  }, [ride, navigate, rideId]);

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-xs text-slate-500">Ride in progress</p>
        <p className="font-semibold mt-0.5">{ride?.pickup?.address} → {ride?.drop?.address}</p>
      </Card>
      <LiveTrackingMap pickup={ride?.pickup} drop={ride?.drop} driver={driverPos} />
      <div className="grid grid-cols-2 gap-3">
        <Card><p className="text-xs text-slate-500">Fare</p><p className="font-bold text-lg">{formatCurrency(ride?.fare)}</p></Card>
        <Card><p className="text-xs text-slate-500">Distance</p><p className="font-bold text-lg">{ride?.distanceKm?.toFixed?.(1)} km</p></Card>
      </div>
    </div>
  );
}
