import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { driverApi } from '../services/driver.api.js';
import DriverHistoryList from '../components/DriverHistoryList.jsx';
import Loader from '../../../core/components/ui/Loader.jsx';

export default function DriverRideHistoryPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    driverApi.driverHistory().then((r) => setRides(r.data || [])).finally(() => setLoading(false));
  }, []);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Ride History</h2>
      {loading ? <Loader /> : <DriverHistoryList rides={rides} onOpen={(r) => navigate(`/driver/summary/${r.id}`)} />}
    </div>
  );
}
