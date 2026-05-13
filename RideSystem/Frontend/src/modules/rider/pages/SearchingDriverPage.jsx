import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { useRideTracking } from '../hooks/useRideTracking.js';
import { rideApi } from '../services/ride.api.js';

export default function SearchingDriverPage() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { ride } = useRideTracking(rideId);

  useEffect(() => {
    if (ride && ride.status !== 'REQUESTED') navigate(`/rider/accepted/${rideId}`);
  }, [ride, rideId, navigate]);

  const cancel = async () => {
    await rideApi.cancel(rideId);
    navigate('/rider');
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-col items-center text-center py-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-brand/30 animate-ping" />
            <div className="absolute inset-3 rounded-full bg-brand text-white grid place-items-center text-3xl">🚖</div>
          </div>
          <p className="font-semibold mt-4">Finding you a driver…</p>
          <p className="text-xs text-slate-500 mt-1">This usually takes under a minute</p>
        </div>
        <Button variant="secondary" className="w-full" onClick={cancel}>Cancel request</Button>
      </Card>

      {ride && (
        <Card>
          <p className="text-xs text-slate-500">Fare estimate</p>
          <p className="font-bold text-xl">₹{ride.fare}</p>
          <p className="text-xs text-slate-500 mt-1">{ride.distanceKm?.toFixed?.(1)} km</p>
        </Card>
      )}
    </div>
  );
}
