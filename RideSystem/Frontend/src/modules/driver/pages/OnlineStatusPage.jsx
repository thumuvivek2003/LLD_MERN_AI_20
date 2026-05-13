import DriverStatusToggle from '../components/DriverStatusToggle.jsx';
import { useDriverStatus } from '../hooks/useDriverStatus.js';

export default function OnlineStatusPage() {
  const { driver, setStatus } = useDriverStatus();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Availability</h2>
      <DriverStatusToggle status={driver?.status} onChange={setStatus} />
    </div>
  );
}
