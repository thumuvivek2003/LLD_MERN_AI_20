import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../services/admin.api.js';
import { RestaurantForm } from '../../../shared/components/forms/RestaurantForm.jsx';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { showErrorToast, showSuccessToast } from '../../../core/services/notification.service.js';

export const EditRestaurantPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.getRestaurant(id).then((r) => setRestaurant(r.data)); }, [id]);

  const submit = async (data) => {
    setLoading(true);
    try { await api.updateRestaurant(id, data); showSuccessToast('Saved'); navigate('/admin/restaurants'); }
    catch (e) { showErrorToast(e.message); }
    finally { setLoading(false); }
  };

  if (!restaurant) return <Loader />;
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Edit Restaurant</h1>
      <div className="card p-5">
        <RestaurantForm initial={restaurant} onSubmit={submit} loading={loading} submitLabel="Save Changes" />
      </div>
    </div>
  );
};
