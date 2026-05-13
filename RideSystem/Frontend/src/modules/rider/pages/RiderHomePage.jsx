import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Card from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import RideStatusBadge from '../../../core/components/ride/RideStatusBadge.jsx';
import { rideApi } from '../services/ride.api.js';
import { useAuth } from '../../../core/hooks/useAuth.js';

export default function RiderHomePage() {
  const { user } = useAuth();
  const [active, setActive] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    rideApi.myActive().then((r) => setActive(r.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
        <p className="text-slate-500 text-sm">Where would you like to go?</p>
      </div>

      <Card>
        <div className="flex items-center gap-3 mb-3">
          <span className="w-10 h-10 rounded-full bg-brand-light grid place-items-center text-xl">🚖</span>
          <div>
            <p className="font-semibold">Book a ride</p>
            <p className="text-xs text-slate-500">Pickup & drop, find a driver in seconds</p>
          </div>
        </div>
        <Link to="/rider/find"><Button className="w-full">Book Ride</Button></Link>
      </Card>

      {active && (
        <Card>
          <p className="text-xs text-slate-500">Active ride</p>
          <div className="flex items-center justify-between mt-1">
            <p className="font-semibold">{active.pickup?.address} → {active.drop?.address}</p>
            <RideStatusBadge status={active.status} />
          </div>
          <Button variant="secondary" className="mt-3 w-full" onClick={() => navigate(`/rider/tracking/${active.id}`)}>
            Resume ride
          </Button>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-3xl">🧾</p>
          <p className="font-semibold mt-2">Past rides</p>
          <p className="text-xs text-slate-500">View ride history</p>
          <Link to="/rider/history" className="text-brand text-sm font-semibold mt-2 inline-block">View →</Link>
        </Card>
        <Card>
          <p className="text-3xl">⭐</p>
          <p className="font-semibold mt-2">Your rating</p>
          <p className="text-xs text-slate-500">As a rider</p>
          <p className="text-lg font-bold mt-2">{user?.rating?.toFixed?.(1) || '5.0'}</p>
        </Card>
      </div>
    </div>
  );
}
