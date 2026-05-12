import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../services/delivery.api.js';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { formatCurrency } from '../../../core/utils/currency.util.js';
import { DELIVERY_STATUS_LABEL } from '../constants.js';
import { showSuccessToast } from '../../../core/services/notification.service.js';

export const DeliveryDashboardPage = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => { api.getMyProfile().then((r) => setProfile(r.data)); }, []);

  const toggle = async () => {
    const next = profile.status === 'AVAILABLE' ? 'OFFLINE' : 'AVAILABLE';
    const r = await api.setAvailability(next);
    setProfile(r.data);
    showSuccessToast(`Status: ${next}`);
  };

  if (!profile) return <Loader />;

  return (
    <div>
      <div className="card p-6 mb-4 bg-gradient-to-br from-brand to-brand-dark text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <div className="opacity-90 mt-1">★ {profile.rating} · {DELIVERY_STATUS_LABEL[profile.status]}</div>
          </div>
          <Button variant="outline" onClick={toggle} className="bg-white">
            {profile.status === 'AVAILABLE' ? 'Go Offline' : 'Go Online'}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="card p-4">
          <div className="text-2xl">💰</div>
          <div className="text-sm text-gray-500">Earnings</div>
          <div className="text-2xl font-bold">{formatCurrency(profile.earnings || 0)}</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl">📦</div>
          <div className="text-sm text-gray-500">Completed</div>
          <div className="text-2xl font-bold">{profile.completedCount || 0}</div>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Link to="/delivery/available" className="btn-primary">View available</Link>
        <Link to="/delivery/ongoing" className="btn-outline">Ongoing</Link>
      </div>
    </div>
  );
};
