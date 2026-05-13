import { Link } from 'react-router-dom';
import Card from '../../../core/components/ui/Card.jsx';
import { useAuth } from '../../../core/hooks/useAuth.js';
import { useDriverStatus } from '../hooks/useDriverStatus.js';

export default function DriverProfilePage() {
  const { user, signOut } = useAuth();
  const { driver } = useDriverStatus();
  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-200 grid place-items-center text-2xl font-bold">{user?.name?.[0]}</div>
          <div>
            <p className="font-bold text-lg">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <p className="text-xs text-slate-500 mt-1">⭐ {driver?.rating?.toFixed?.(1) || '5.0'} · {driver?.totalTrips || 0} trips</p>
          </div>
        </div>
      </Card>
      <Card>
        <ul className="divide-y divide-slate-100">
          <li className="py-3 flex items-center justify-between"><span>Vehicle</span><Link to="/driver/vehicle" className="text-brand text-sm font-semibold">Manage →</Link></li>
          <li className="py-3 flex items-center justify-between"><span>Availability</span><Link to="/driver/online" className="text-brand text-sm font-semibold">Open →</Link></li>
          <li className="py-3 flex items-center justify-between"><span>Earnings</span><Link to="/driver/earnings" className="text-brand text-sm font-semibold">View →</Link></li>
          <li className="py-3 flex items-center justify-between"><span>Sign out</span><button onClick={signOut} className="text-red-500 text-sm font-semibold">Logout</button></li>
        </ul>
      </Card>
    </div>
  );
}
