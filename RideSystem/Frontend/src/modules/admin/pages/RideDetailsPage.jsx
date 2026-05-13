import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../../core/components/ui/Card.jsx';
import RouteMap from '../../../core/components/map/RouteMap.jsx';
import RideStatusBadge from '../../../core/components/ride/RideStatusBadge.jsx';
import { apiClient } from '../../../core/api/axios.client.js';
import { formatDate } from '../../../core/utils/formatDate.js';
import { formatCurrency } from '../../../core/utils/formatCurrency.js';
import Loader from '../../../core/components/ui/Loader.jsx';

export default function AdminRideDetailsPage() {
  const { rideId } = useParams();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get(`/rides/${rideId}`).then((r) => setRide(r.data)).finally(() => setLoading(false));
  }, [rideId]);

  if (loading) return <Loader />;
  if (!ride) return null;

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex justify-between">
          <p className="font-semibold">Ride {ride.id}</p>
          <RideStatusBadge status={ride.status} />
        </div>
        <p className="text-xs text-slate-500 mt-1">{formatDate(ride.createdAt)}</p>
      </Card>
      <RouteMap pickup={ride.pickup} drop={ride.drop} />
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <p className="font-semibold mb-2">Rider</p>
          <p className="text-sm">{ride.rider?.name}</p>
          <p className="text-xs text-slate-500">{ride.rider?.email}</p>
        </Card>
        <Card>
          <p className="font-semibold mb-2">Driver</p>
          <p className="text-sm">{ride.driver?.name || '—'}</p>
          <p className="text-xs text-slate-500">{ride.driver?.email}</p>
        </Card>
      </div>
      <Card>
        <ul className="divide-y divide-slate-100 text-sm">
          <li className="py-2 flex justify-between"><span>Fare</span><span className="font-bold">{formatCurrency(ride.fare)}</span></li>
          <li className="py-2 flex justify-between"><span>Distance</span><span>{ride.distanceKm?.toFixed?.(1)} km</span></li>
          <li className="py-2 flex justify-between"><span>Payment</span><span>{ride.paymentStatus}</span></li>
        </ul>
      </Card>
    </div>
  );
}
