import { Link } from 'react-router-dom';
import { useAdminDashboard } from '../hooks/useAdminDashboard.js';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { USER_ROLES } from '../../../core/constants/roles.constants.js';

const Stat = ({ label, value, icon, to }) => (
  <Link to={to} className="card p-4 hover:shadow-md transition block">
    <div className="text-2xl">{icon}</div>
    <div className="text-sm text-gray-500 mt-1">{label}</div>
    <div className="text-2xl font-bold">{value}</div>
  </Link>
);

export const AdminDashboardPage = () => {
  const { users, restaurants, loading } = useAdminDashboard();
  if (loading) return <Loader />;

  const counts = {
    customers: users.filter((u) => u.role === USER_ROLES.CUSTOMER).length,
    restaurantAdmins: users.filter((u) => u.role === USER_ROLES.RESTAURANT_ADMIN).length,
    deliveryPartners: users.filter((u) => u.role === USER_ROLES.DELIVERY_PARTNER).length,
    blocked: users.filter((u) => u.isBlocked).length,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Customers" value={counts.customers} icon="👥" to="/admin/users" />
        <Stat label="Restaurant Admins" value={counts.restaurantAdmins} icon="🏪" to="/admin/users" />
        <Stat label="Delivery Partners" value={counts.deliveryPartners} icon="🛵" to="/admin/users" />
        <Stat label="Restaurants" value={restaurants.length} icon="🍴" to="/admin/restaurants" />
      </div>
      <div className="card p-4">
        <h3 className="font-semibold mb-2">Quick actions</h3>
        <div className="flex gap-2 flex-wrap">
          <Link to="/admin/users" className="btn-outline">Manage users</Link>
          <Link to="/admin/restaurants" className="btn-outline">Manage restaurants</Link>
          <Link to="/admin/restaurants/add" className="btn-primary">+ New restaurant</Link>
        </div>
      </div>
    </div>
  );
};
