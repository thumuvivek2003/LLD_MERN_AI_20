import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import DriverRideMap from '../components/DriverRideMap.jsx';
import { driverApi } from '../services/driver.api.js';
import { useDriverTracking } from '../hooks/useDriverTracking.js';
import { useAuth } from '../../../core/hooks/useAuth.js';
import { formatCurrency } from '../../../core/utils/formatCurrency.js';

export default function DriverRidePage() {
  const { rideId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);

  useEffect(() => {
    import('../../../core/api/axios.client.js').then(({ apiClient }) =>
      apiClient.get(`/rides/${rideId}`).then((r) => setRide(r.data)),
    );
  }, [rideId]);

  useDriverTracking({ rideId, riderId: ride?.rider?.id, driverId: user?.id });

  const complete = async () => {
    await driverApi.complete(rideId);
    navigate(`/driver/summary/${rideId}`);
  };

  return (
    <div className="space-y-4">
      <DriverRideMap pickup={ride?.pickup} drop={ride?.drop} />
      <div className="grid grid-cols-2 gap-3">
        <Card><p className="text-xs text-slate-500">Distance</p><p className="font-bold text-lg">{ride?.distanceKm?.toFixed?.(1)} km</p></Card>
        <Card><p className="text-xs text-slate-500">Fare</p><p className="font-bold text-lg">{formatCurrency(ride?.fare)}</p></Card>
      </div>
      <Card>
        <p className="font-semibold">Rider</p>
        <p className="text-sm text-slate-500 mt-1">{ride?.rider?.name}</p>
      </Card>
      <Button variant="danger" className="w-full" onClick={complete}>End ride</Button>
    </div>
  );
}
