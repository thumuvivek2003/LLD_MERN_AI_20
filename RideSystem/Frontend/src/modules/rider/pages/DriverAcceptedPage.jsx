import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../core/components/ui/Button.jsx';
import Card from '../../../core/components/ui/Card.jsx';
import DriverInfoCard from '../components/DriverInfoCard.jsx';
import { useRideTracking } from '../hooks/useRideTracking.js';

export default function DriverAcceptedPage() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { ride } = useRideTracking(rideId);

  if (!ride) return null;
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 grid place-items-center rounded-full bg-emerald-100 text-emerald-700 text-xl">✓</div>
          <div>
            <p className="font-semibold">Driver Accepted</p>
            <p className="text-xs text-slate-500">Your driver is on the way</p>
          </div>
        </div>
      </Card>
      <DriverInfoCard driver={ride.driver} vehicle={ride.vehicle} />
      <Card>
        <p className="text-xs text-slate-500">Share this OTP with driver</p>
        <div className="mt-2 inline-flex gap-2">
          {String(ride.otp || '').split('').map((d, i) => (
            <span key={i} className="w-10 h-12 rounded-lg bg-slate-100 grid place-items-center font-bold text-lg">{d}</span>
          ))}
        </div>
      </Card>
      <Button className="w-full" onClick={() => navigate(`/rider/tracking/${rideId}`)}>Track driver</Button>
    </div>
  );
}
