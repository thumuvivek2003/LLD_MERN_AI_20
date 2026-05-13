import { useNavigate } from 'react-router-dom';
import Card from '../../../core/components/ui/Card.jsx';
import RideSearchForm from '../components/RideSearchForm.jsx';
import { useRideBooking } from '../hooks/useRideBooking.js';
import { rideApi } from '../services/ride.api.js';
import { toast } from '../../../core/utils/toast.util.js';

export default function FindDriverPage() {
  const { request, loading } = useRideBooking();
  const navigate = useNavigate();

  const onSubmit = async (payload) => {
    try {
      const ride = await request(payload);
      toast.info('Searching driver', 'We are looking for a driver near you');
      navigate(`/rider/searching/${ride.id}`);
    } catch (e) {
      // If blocked due to an unpaid past ride, push the user to the payment screen
      try {
        const r = await rideApi.myUnpaid();
        if (r.data) {
          toast.info('Pending payment', `Please pay ₹${r.data.fare} for your last ride first`);
          navigate(`/rider/pay/${r.data.id}`);
          return;
        }
      } catch {}
      toast.error('Could not request ride', e.message);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Where to?</h2>
      <Card><RideSearchForm onSubmit={onSubmit} loading={loading} /></Card>
    </div>
  );
}
