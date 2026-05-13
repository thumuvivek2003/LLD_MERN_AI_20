import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Card from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import DriverRideMap from '../components/DriverRideMap.jsx';
import { driverApi } from '../services/driver.api.js';
import { useDriverTracking } from '../hooks/useDriverTracking.js';
import { useAuth } from '../../../core/hooks/useAuth.js';

export default function RideAcceptedPage() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ride, setRide] = useState(null);

  useEffect(() => {
    driverApi.pendingRides; // noop reference for tree-shake friendliness
  }, []);

  useEffect(() => {
    // Get ride detail using the rides endpoint via apiClient embedded in driverApi (reuse cancel? simpler: fetch via /rides/:id)
    import('../../../core/api/axios.client.js').then(({ apiClient }) =>
      apiClient.get(`/rides/${rideId}`).then((r) => setRide(r.data)),
    );
  }, [rideId]);

  useDriverTracking({ rideId, riderId: ride?.rider?.id, driverId: user?.id });

  const arrive = async () => {
    await driverApi.arrive(rideId);
    navigate(`/driver/otp/${rideId}`);
  };

  return (
    <div className="space-y-4">
      <Card>
        <p className="text-xs text-slate-500">Ride Accepted</p>
        <p className="font-semibold">Head to the rider's pickup location</p>
      </Card>
      <DriverRideMap pickup={ride?.pickup} drop={ride?.drop} />
      <Card>
        <p className="font-semibold">Rider</p>
        <p className="text-sm text-slate-500 mt-1">{ride?.rider?.name} · {ride?.rider?.phone || '—'}</p>
      </Card>
      <Button className="w-full" onClick={arrive}>I have reached</Button>
    </div>
  );
}
