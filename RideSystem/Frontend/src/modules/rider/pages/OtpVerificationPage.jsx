import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { useRideTracking } from '../hooks/useRideTracking.js';

export default function OtpVerificationPage() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { ride } = useRideTracking(rideId);

  return (
    <div className="space-y-4">
      <Card>
        <div className="text-center py-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 grid place-items-center text-3xl">✓</div>
          <p className="font-semibold mt-3">Driver Arrived</p>
          <p className="text-xs text-slate-500 mt-1">Your driver is at the pickup location</p>
          <p className="text-sm mt-4 text-slate-600">Share OTP to start the trip</p>
          <div className="mt-3 inline-flex gap-2">
            {String(ride?.otp || '').split('').map((d, i) => (
              <span key={i} className="w-12 h-14 rounded-xl border-2 border-brand text-2xl font-bold grid place-items-center">{d}</span>
            ))}
          </div>
        </div>
      </Card>
      <Button variant="secondary" className="w-full" onClick={() => navigate(`/rider/tracking/${rideId}`)}>Back to tracking</Button>
    </div>
  );
}
