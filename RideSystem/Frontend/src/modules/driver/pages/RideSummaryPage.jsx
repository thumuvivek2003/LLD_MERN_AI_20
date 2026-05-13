import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import Badge from '../../../core/components/ui/Badge.jsx';
import { formatCurrency } from '../../../core/utils/formatCurrency.js';
import { apiClient } from '../../../core/api/axios.client.js';
import { driverApi } from '../services/driver.api.js';
import { toast } from '../../../core/utils/toast.util.js';
import { PAYMENT_STATUS } from '../../../core/constants/payment.constants.js';

export default function RideSummaryPage() {
  const { rideId } = useParams();
  const [ride, setRide] = useState(null);
  const [collecting, setCollecting] = useState(false);
  const navigate = useNavigate();

  const load = () => apiClient.get(`/rides/${rideId}`).then((r) => setRide(r.data));
  useEffect(() => { load(); }, [rideId]);

  const isPaid = ride?.paymentStatus === PAYMENT_STATUS.PAID;

  const receiveCash = async () => {
    setCollecting(true);
    try {
      await driverApi.receiveCash(rideId);
      toast.success('Cash received', 'Ride marked as paid');
      await load();
    } catch (e) {
      toast.error('Could not collect cash', e.message);
    } finally {
      setCollecting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="text-center py-6">
          <div className={`w-16 h-16 mx-auto rounded-full grid place-items-center text-3xl ${isPaid ? 'bg-emerald-100' : 'bg-amber-100'}`}>
            {isPaid ? '✓' : '💵'}
          </div>
          <p className="font-semibold mt-3">Ride Completed</p>
          <p className="text-xs text-slate-500 mt-1">
            {isPaid ? 'Payment received. Great job!' : 'Awaiting payment from rider'}
          </p>
          <p className="text-3xl font-bold mt-4">{formatCurrency(ride?.fare)}</p>
          <p className="text-xs text-slate-500 mt-1">{ride?.distanceKm?.toFixed?.(1)} km</p>
          <div className="mt-3">
            {isPaid
              ? <Badge tone="success">Paid</Badge>
              : <Badge tone="warning">Payment pending</Badge>}
          </div>
        </div>
      </Card>

      {ride && !isPaid && (
        <Button className="w-full" disabled={collecting} onClick={receiveCash}>
          {collecting ? 'Collecting...' : `Receive Cash ${formatCurrency(ride.fare)}`}
        </Button>
      )}

      <Button variant="secondary" className="w-full" onClick={() => navigate('/driver')}>
        Back to home
      </Button>
    </div>
  );
}
