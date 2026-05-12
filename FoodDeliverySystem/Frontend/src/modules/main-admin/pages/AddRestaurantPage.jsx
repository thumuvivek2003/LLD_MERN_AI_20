import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/admin.api.js';
import { RestaurantForm } from '../../../shared/components/forms/RestaurantForm.jsx';
import { showErrorToast, showSuccessToast } from '../../../core/services/notification.service.js';

export const AddRestaurantPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (data) => {
    setLoading(true);
    try { await api.createRestaurant(data); showSuccessToast('Created'); navigate('/admin/restaurants'); }
    catch (e) { showErrorToast(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Add Restaurant</h1>
      <div className="card p-5">
        <RestaurantForm onSubmit={submit} loading={loading} submitLabel="Add" />
      </div>
    </div>
  );
};
