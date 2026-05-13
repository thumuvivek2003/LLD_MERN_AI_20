import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import RideRequestCard from '../components/RideRequestCard.jsx';
import Loader from '../../../core/components/ui/Loader.jsx';
import { useIncomingRides } from '../hooks/useIncomingRides.js';
import { useDriverStatus } from '../hooks/useDriverStatus.js';
import { driverApi } from '../services/driver.api.js';
import { toast } from '../../../core/utils/toast.util.js';
import { DRIVER_STATUS } from '../../../../../Backend/src/config/constants.js';

export default function IncomingRidePage() {
  const { driver, setStatus } = useDriverStatus();
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

  if (driver?.status === DRIVER_STATUS.OFFLINE) {
    return (
      <Card>
        <p className="text-center text-3xl py-3">📴</p>
        <p className="text-center font-semibold">You're offline</p>
        <p className="text-center text-sm text-slate-500 mb-4">
          Go online to start receiving ride requests
        </p>
        <Button className="w-full" onClick={() => setStatus(DRIVER_STATUS.ONLINE)}>
          Go online
        </Button>
      </Card>
    );
  }

  if (driver?.status === DRIVER_STATUS.BUSY) {
    return (
      <Card>
        <p className="text-center text-3xl py-3">🚗</p>
        <p className="text-center font-semibold">You already have a ride</p>
        <p className="text-center text-sm text-slate-500 mb-4">
          Finish your current ride before accepting another
        </p>
        <Link to="/driver"><Button className="w-full" variant="secondary">Go to dashboard</Button></Link>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold">New Ride Requests</h2>
      {!rides.length && <Card><p className="text-center text-slate-500 py-6">No new requests. Stay online — they will come!</p></Card>}
      {rides.map((r) => <RideRequestCard key={r.id} ride={r} onAccept={onAccept} busy={busy} />)}
    </div>
  );
}
