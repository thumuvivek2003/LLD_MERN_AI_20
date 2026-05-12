import { useEffect, useState } from 'react';
import * as api from '../services/delivery.api.js';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { formatCurrency } from '../../../core/utils/currency.util.js';

export const EarningsPage = () => {
  const [profile, setProfile] = useState(null);
  useEffect(() => { api.getMyProfile().then((r) => setProfile(r.data)); }, []);

  if (!profile) return <Loader />;
  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-3">Earnings</h1>
      <div className="card p-6 text-center bg-gradient-to-br from-green-500 to-emerald-600 text-white">
        <div className="text-sm opacity-90">Total earnings</div>
        <div className="text-4xl font-extrabold mt-2">{formatCurrency(profile.earnings || 0)}</div>
        <div className="text-sm opacity-90 mt-2">{profile.completedCount || 0} deliveries completed</div>
      </div>
    </div>
  );
};
