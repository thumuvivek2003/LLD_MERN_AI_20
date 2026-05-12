import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/restaurant-admin.api.js';
import { MenuItemForm } from '../../../shared/components/forms/MenuItemForm.jsx';
import { showErrorToast, showSuccessToast } from '../../../core/services/notification.service.js';
import { Loader } from '../../../shared/components/ui/Loader.jsx';

export const AddMenuItemPage = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { api.getMyRestaurant().then((r) => setRestaurant(r.data)); }, []);

  const handle = async (data) => {
    setLoading(true);
    try { await api.createMenuItem(data); showSuccessToast('Added'); navigate('/restaurant/menu'); }
    catch (e) { showErrorToast(e.message); }
    finally { setLoading(false); }
  };

  if (!restaurant) return <Loader />;
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Add Menu Item</h1>
      <div className="card p-5">
        <MenuItemForm restaurantId={restaurant.id} onSubmit={handle} loading={loading} submitLabel="Add Item" />
      </div>
    </div>
  );
};
