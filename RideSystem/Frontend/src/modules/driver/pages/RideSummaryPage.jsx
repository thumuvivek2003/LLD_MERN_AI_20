import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import { formatCurrency } from '../../../core/utils/formatCurrency.js';

export default function RideSummaryPage() {
  const { rideId } = useParams();
  const [ride, setRide] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    import('../../../core/api/axios.client.js').then(({ apiClient }) =>
      apiClient.get(`/rides/${rideId}`).then((r) => setRide(r.data)),
    );
  }, [rideId]);

  return (
    <div className="space-y-4">
      <Card>
        <div className="text-center py-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 grid place-items-center text-3xl">✓</div>
          <p className="font-semibold mt-3">Ride Completed</p>
          <p className="text-xs text-slate-500 mt-1">Great job!</p>
          <p className="text-3xl font-bold mt-4">{formatCurrency(ride?.fare)}</p>
          <p className="text-xs text-slate-500 mt-1">{ride?.distanceKm?.toFixed?.(1)} km</p>
        </div>
      </Card>
      <Button className="w-full" onClick={() => navigate('/driver')}>Back to home</Button>
    </div>
  );
}
