import { Link } from 'react-router-dom';
import Card from '../../../core/components/ui/Card.jsx';
import Button from '../../../core/components/ui/Button.jsx';
import DriverEarningsCard from '../components/DriverEarningsCard.jsx';
import DriverStatusToggle from '../components/DriverStatusToggle.jsx';
import { useDriverStatus } from '../hooks/useDriverStatus.js';
import { earningsApi } from '../services/earnings.api.js';
import { useEffect, useState } from 'react';

export default function DriverDashboardPage() {
  const { driver, setStatus } = useDriverStatus();
  const [earnings, setEarnings] = useState({ total: 0, count: 0 });

  useEffect(() => { earningsApi.summary().then((r) => setEarnings(r.data)).catch(() => {}); }, []);

  const noVehicle = driver && !driver.activeVehicle;

  return (
    <div className="space-y-4">
      <DriverStatusToggle status={driver?.status} onChange={setStatus} />
      {noVehicle && (
        <Card>
          <p className="font-semibold">No vehicle registered</p>
          <p className="text-xs text-slate-500 mt-1">Register a vehicle to start accepting rides.</p>
          <Link to="/driver/vehicle"><Button className="w-full mt-3">Register vehicle</Button></Link>
        </Card>
      )}
      <DriverEarningsCard total={earnings.total} count={earnings.count} />
      <div className="grid grid-cols-2 gap-3">
        <Link to="/driver/incoming"><Card className="text-center"><p className="text-2xl">🚗</p><p className="font-semibold mt-1">Incoming Rides</p></Card></Link>
        <Link to="/driver/history"><Card className="text-center"><p className="text-2xl">🧾</p><p className="font-semibold mt-1">History</p></Card></Link>
      </div>
    </div>
  );
}
