import { useNavigate } from 'react-router-dom';
import Card from '../../../core/components/ui/Card.jsx';
import RideSearchForm from '../components/RideSearchForm.jsx';
import { useRideBooking } from '../hooks/useRideBooking.js';
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
