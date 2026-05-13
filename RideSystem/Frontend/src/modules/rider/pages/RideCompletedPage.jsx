import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { useRideTracking } from '../hooks/useRideTracking.js';
import { formatCurrency } from '../../../core/utils/formatCurrency.js';

export default function RideCompletedPage() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { ride } = useRideTracking(rideId);

  return (
    <div className="space-y-4">
      <Card>
        <div className="text-center py-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 grid place-items-center text-3xl">✓</div>
          <p className="font-semibold mt-3">Ride Completed</p>
          <p className="text-xs text-slate-500 mt-1">Your ride was completed</p>
          <p className="text-3xl font-bold mt-4">{formatCurrency(ride?.fare)}</p>
          <p className="text-xs text-slate-500 mt-1">{ride?.distanceKm?.toFixed?.(1)} km</p>
        </div>
      </Card>
      <Button className="w-full" onClick={() => navigate(`/rider/pay/${rideId}`)}>Pay now</Button>
      <Button variant="secondary" className="w-full" onClick={() => navigate(`/rider/ride/${rideId}`)}>View bill details</Button>
    </div>
  );
}
