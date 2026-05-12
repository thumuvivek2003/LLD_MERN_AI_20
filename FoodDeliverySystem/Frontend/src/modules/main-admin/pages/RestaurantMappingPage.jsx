import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../services/admin.api.js';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { Select } from '../../../shared/components/ui/Input.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { USER_ROLES } from '../../../core/constants/roles.constants.js';
import { showErrorToast, showSuccessToast } from '../../../core/services/notification.service.js';

export const RestaurantMappingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.getRestaurant(id), api.getUsers(USER_ROLES.RESTAURANT_ADMIN)])
      .then(([r, u]) => {
        setRestaurant(r.data); setAdmins(u.data || []);
        setSelected(r.data.managedBy || '');
      });
  }, [id]);

  const submit = async () => {
    if (!selected) return showErrorToast('Pick an admin');
    setLoading(true);
    try { await api.assignRestaurantAdmin(id, selected); showSuccessToast('Mapped'); navigate('/admin/restaurants'); }
    catch (e) { showErrorToast(e.message); }
    finally { setLoading(false); }
  };

  if (!restaurant) return <Loader />;
  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-2">Map Admin</h1>
      <p className="text-gray-500 mb-4">Assign a Restaurant Admin to <strong>{restaurant.name}</strong></p>
      <div className="card p-5">
        <Select label="Admin user" value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="">-- Select --</option>
          {admins.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.email})</option>)}
        </Select>
        {admins.length === 0 && (
          <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded mb-2">
            No Restaurant Admins exist. Create one via Register or change a user's role.
          </p>
        )}
        <Button onClick={submit} disabled={loading} className="w-full">
          {loading ? 'Saving…' : 'Save Mapping'}
        </Button>
      </div>
    </div>
  );
};
