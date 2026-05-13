import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../core/components/ui/Card.jsx';
import RideRequestCard from '../components/RideRequestCard.jsx';
import Loader from '../../../core/components/ui/Loader.jsx';
import { useIncomingRides } from '../hooks/useIncomingRides.js';
import { driverApi } from '../services/driver.api.js';
import { toast } from '../../../core/utils/toast.util.js';

export default function IncomingRidePage() {
  const { rides, loading } = useIncomingRides();
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const onAccept = async (ride) => {
    setBusy(true);
    try {
      const res = await driverApi.accept(ride.id);
      toast.success('Ride accepted', 'Head to the pickup');
      navigate(`/driver/accepted/${res.data.id}`);
    } catch (e) {
      toast.error('Could not accept', e.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loader label="Looking for rides" />;

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">New Ride Requests</h2>
      {!rides.length && <Card><p className="text-center text-slate-500 py-6">No new requests. Stay online — they will come!</p></Card>}
      {rides.map((r) => <RideRequestCard key={r.id} ride={r} onAccept={onAccept} busy={busy} />)}
    </div>
  );
}
