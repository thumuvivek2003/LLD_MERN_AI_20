import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../services/admin.api.js';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { Table } from '../../../shared/components/ui/Table.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';

export const RestaurantsManagementPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRestaurants().then((r) => setRestaurants(r.data || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'address', label: 'Address' },
    { key: 'rating', label: 'Rating', render: (r) => <span>★ {r.rating}</span> },
    {
      key: 'status', label: 'Mapped',
      render: (r) => r.managedBy
        ? <Badge color="bg-green-100 text-green-800">Mapped</Badge>
        : <Badge color="bg-amber-100 text-amber-800">Unmapped</Badge>,
    },
    {
      key: 'actions', label: '',
      render: (r) => (
        <div className="flex gap-2 justify-end">
          <Link to={`/admin/restaurants/${r.id}/mapping`} className="btn-outline text-sm px-3 py-1.5">Map Admin</Link>
          <Link to={`/admin/restaurants/${r.id}/edit`} className="btn-outline text-sm px-3 py-1.5">Edit</Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Restaurants</h1>
        <Link to="/admin/restaurants/add" className="btn-primary">+ Add Restaurant</Link>
      </div>
      <Table columns={columns} rows={restaurants} />
    </div>
  );
};
