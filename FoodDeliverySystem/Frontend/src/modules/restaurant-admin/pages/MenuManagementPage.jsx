import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../services/restaurant-admin.api.js';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { EmptyState } from '../../../shared/components/ui/EmptyState.jsx';
import { formatCurrency } from '../../../core/utils/currency.util.js';
import { showErrorToast, showSuccessToast } from '../../../core/services/notification.service.js';

export const MenuManagementPage = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.getMyRestaurant();
      setRestaurant(r.data);
      if (r.data) {
        const m = await api.getMenu(r.data.id);
        setItems(m.data || []);
      }
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const toggle = async (id) => {
    try { await api.toggleAvailability(id); await load(); showSuccessToast('Updated'); }
    catch (e) { showErrorToast(e.message); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try { await api.deleteMenuItem(id); await load(); showSuccessToast('Deleted'); }
    catch (e) { showErrorToast(e.message); }
  };

  if (loading) return <Loader />;
  if (!restaurant) return <EmptyState icon="🏪" title="No restaurant assigned" subtitle="Contact the System Admin." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Menu</h1>
        <Link to="/restaurant/menu/add" className="btn-primary">+ Add Item</Link>
      </div>

      {items.length === 0 ? <EmptyState icon="🍽️" title="No menu items yet" /> : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((i) => (
            <div key={i.id} className="card p-4 flex gap-3">
              <img src={i.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'} className="w-20 h-20 rounded-lg object-cover" alt={i.name} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold truncate">{i.name}</h3>
                  <Badge color={i.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                    {i.isAvailable ? 'Available' : 'Off'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 line-clamp-1">{i.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-semibold">{formatCurrency(i.price)}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => toggle(i.id)}>{i.isAvailable ? 'Hide' : 'Show'}</Button>
                    <Link to={`/restaurant/menu/${i.id}/edit`} className="btn-outline px-3 py-1.5 text-sm">Edit</Link>
                    <Button size="sm" variant="danger" onClick={() => remove(i.id)}>×</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
