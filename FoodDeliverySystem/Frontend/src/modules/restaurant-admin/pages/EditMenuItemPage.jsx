import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../services/restaurant-admin.api.js';
import { MenuItemForm } from '../../../shared/components/forms/MenuItemForm.jsx';
import { showErrorToast, showSuccessToast } from '../../../core/services/notification.service.js';
import { Loader } from '../../../shared/components/ui/Loader.jsx';

export const EditMenuItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.getMenuItem(id).then((r) => setItem(r.data)); }, [id]);

  const handle = async (data) => {
    setLoading(true);
    try { await api.updateMenuItem(id, data); showSuccessToast('Saved'); navigate('/restaurant/menu'); }
    catch (e) { showErrorToast(e.message); }
    finally { setLoading(false); }
  };

  if (!item) return <Loader />;
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Edit Menu Item</h1>
      <div className="card p-5">
        <MenuItemForm initial={item} restaurantId={item.restaurantId} onSubmit={handle} loading={loading} submitLabel="Save Changes" />
      </div>
    </div>
  );
};
