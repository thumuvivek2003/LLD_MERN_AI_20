import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LiveTrackingMap from '../../../core/components/map/LiveTrackingMap.jsx';
import DriverInfoCard from '../components/DriverInfoCard.jsx';
import RideTrackingCard from '../components/RideTrackingCard.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { useRideTracking } from '../hooks/useRideTracking.js';

export default function LiveTrackingPage() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { ride, driverPos } = useRideTracking(rideId);

  useEffect(() => {
    if (!ride) return;
    if (ride.status === 'IN_PROGRESS') navigate(`/rider/in-progress/${rideId}`);
    if (ride.status === 'COMPLETED') navigate(`/rider/completed/${rideId}`);
  }, [ride, navigate, rideId]);

  return (
    <div className="space-y-4">
      <LiveTrackingMap pickup={ride?.pickup} drop={ride?.drop} driver={driverPos} />
      <DriverInfoCard driver={ride?.driver} vehicle={ride?.vehicle} />
      <RideTrackingCard ride={ride} />
      <Button variant="secondary" className="w-full" onClick={() => navigate(`/rider/otp/${rideId}`)}>
        Show trip OTP
      </Button>
    </div>
  );
}
