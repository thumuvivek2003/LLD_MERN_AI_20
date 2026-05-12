import { useEffect, useState } from 'react';
import * as api from '../services/restaurant-admin.api.js';
import { RestaurantForm } from '../../../shared/components/forms/RestaurantForm.jsx';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { EmptyState } from '../../../shared/components/ui/EmptyState.jsx';
import { showSuccessToast, showErrorToast } from '../../../core/services/notification.service.js';

export const RestaurantProfilePage = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getMyRestaurant().then((r) => { setRestaurant(r.data); setReady(true); });
  }, []);

  const save = async (data) => {
    setLoading(true);
    try {
      const r = await api.updateMyRestaurant(restaurant.id, data);
      setRestaurant(r.data);
      showSuccessToast('Saved');
    } catch (e) { showErrorToast(e.message); }
    finally { setLoading(false); }
  };

  if (!ready) return <Loader />;
  if (!restaurant) return <EmptyState icon="🏪" title="No restaurant assigned" subtitle="Contact the System Admin to map your account." />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Restaurant Profile</h1>
      <div className="card p-5">
        <RestaurantForm initial={restaurant} onSubmit={save} loading={loading} submitLabel="Save" />
      </div>
    </div>
  );
};
