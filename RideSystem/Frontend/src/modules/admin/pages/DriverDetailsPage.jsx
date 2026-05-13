import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../../core/components/ui/Card.jsx';
import { adminApi } from '../services/admin.api.js';
import Loader from '../../../core/components/ui/Loader.jsx';

export default function DriverDetailsPage() {
  const { userId } = useParams();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.drivers().then((r) => {
      setDriver((r.data || []).find((d) => d.id === userId) || null);
    }).finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <Loader />;
  if (!driver) return <p className="text-center text-slate-500 py-10">Driver not found</p>;

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-200 grid place-items-center text-2xl font-bold">{driver.name?.[0]}</div>
          <div>
            <p className="font-bold text-lg">{driver.name}</p>
            <p className="text-xs text-slate-500">{driver.email}</p>
          </div>
        </div>
      </Card>
      <Card>
        <ul className="divide-y divide-slate-100 text-sm">
          <li className="py-2 flex justify-between"><span>Phone</span><span className="font-medium">{driver.phone || '—'}</span></li>
          <li className="py-2 flex justify-between"><span>Joined</span><span>{new Date(driver.createdAt).toLocaleString()}</span></li>
          <li className="py-2 flex justify-between"><span>Status</span><span>{driver.isBlocked ? 'Blocked' : 'Active'}</span></li>
        </ul>
      </Card>
    </div>
  );
}
