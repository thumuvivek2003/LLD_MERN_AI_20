import { useNavigate } from 'react-router-dom';
import RideMonitoringList from '../components/RideMonitoringList.jsx';
import { useRideMonitoring } from '../hooks/useRideMonitoring.js';
import Loader from '../../../core/components/ui/Loader.jsx';

export default function RideMonitoringPage() {
  const { rides, loading } = useRideMonitoring();
  const navigate = useNavigate();
  if (loading) return <Loader />;
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Ride Monitoring</h2>
      <RideMonitoringList rides={rides} onOpen={(r) => navigate(`/admin/rides/${r.id}`)} />
    </div>
  );
}
