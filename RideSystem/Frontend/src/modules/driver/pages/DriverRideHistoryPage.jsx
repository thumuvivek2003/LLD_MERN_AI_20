import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { driverApi } from '../services/driver.api.js';
import DriverHistoryList from '../components/DriverHistoryList.jsx';
import Loader from '../../../core/components/ui/Loader.jsx';
import { resolveDriverRoute } from '../utils/resolve-driver-route.js';

export default function DriverRideHistoryPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    driverApi.driverHistory()
      .then((r) => setRides(r.data || []))
      .finally(() => setLoading(false));
  }, []);

  const handleOpen = (ride) => navigate(resolveDriverRoute(ride));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Ride History</h2>
      {loading ? <Loader /> : <DriverHistoryList rides={rides} onOpen={handleOpen} />}
    </div>
  );
}
