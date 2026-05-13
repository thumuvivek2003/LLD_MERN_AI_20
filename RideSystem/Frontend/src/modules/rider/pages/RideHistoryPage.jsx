import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRideHistory } from '../hooks/useRideHistory.js';
import RiderRideHistoryList from '../components/RiderRideHistoryList.jsx';
import Loader from '../../../core/components/ui/Loader.jsx';
import { resolveRiderRoute } from '../utils/resolve-rider-route.js';

export default function RideHistoryPage() {
  const { rides, loading } = useRideHistory();
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  const filtered = filter === 'ALL'
    ? rides
    : rides.filter((r) => r.status === filter);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Ride History</h2>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { v: 'ALL', label: 'All' },
          { v: 'COMPLETED', label: 'Completed' },
          { v: 'CANCELLED', label: 'Cancelled' },
        ].map((t) => (
          <button key={t.v}
            onClick={() => setFilter(t.v)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${filter === t.v ? 'bg-brand text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
            {t.label}
          </button>
        ))}
      </div>
      {loading ? <Loader label="Loading rides" /> :
        <RiderRideHistoryList rides={filtered} onOpen={(r) => navigate(resolveRiderRoute(r))} />}
    </div>
  );
}
