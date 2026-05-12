import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useRestaurantOrders } from '../hooks/useRestaurantOrders.js';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { formatCurrency } from '../../../core/utils/currency.util.js';
import { ORDER_STATUS } from '../../../core/constants/order-status.constants.js';

const Stat = ({ label, value, icon }) => (
  <div className="card p-4">
    <div className="text-2xl">{icon}</div>
    <div className="text-sm text-gray-500 mt-1">{label}</div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

export const DashboardPage = () => {
  const { restaurant, orders, loadOrders, loading } = useRestaurantOrders();
  useEffect(() => { if (restaurant) loadOrders(); }, [restaurant, loadOrders]);

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === ORDER_STATUS.PAID).length;
    const active = orders.filter((o) =>
      [ORDER_STATUS.RESTAURANT_ACCEPTED, ORDER_STATUS.PREPARING, ORDER_STATUS.READY_FOR_PICKUP, ORDER_STATUS.OUT_FOR_DELIVERY].includes(o.status)
    ).length;
    const delivered = orders.filter((o) => o.status === ORDER_STATUS.DELIVERED);
    const revenue = delivered.reduce((s, o) => s + o.totalAmount, 0);
    return { pending, active, delivered: delivered.length, revenue };
  }, [orders]);

  if (!restaurant) return <div className="card p-6 text-center">
    <h2 className="text-lg font-semibold mb-2">No restaurant assigned yet</h2>
    <p className="text-sm text-gray-500">Ask the System Admin to map a restaurant to your account.</p>
  </div>;
  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">{restaurant.name}</h1>
      <p className="text-gray-500 mb-6">{restaurant.address}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Pending" value={stats.pending} icon="🆕" />
        <Stat label="In progress" value={stats.active} icon="🔥" />
        <Stat label="Delivered" value={stats.delivered} icon="✅" />
        <Stat label="Revenue" value={formatCurrency(stats.revenue)} icon="💰" />
      </div>
      <Link to="/restaurant/orders" className="btn-primary inline-block">View incoming orders</Link>
    </div>
  );
};
