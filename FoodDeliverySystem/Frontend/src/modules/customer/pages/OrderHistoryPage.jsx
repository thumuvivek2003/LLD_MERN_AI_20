import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders.js';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { EmptyState } from '../../../shared/components/ui/EmptyState.jsx';
import { OrderCard } from '../../../shared/components/cards/OrderCard.jsx';

export const OrderHistoryPage = () => {
  const { orders, loading, loadMyOrders } = useOrders();
  useEffect(() => { loadMyOrders(); }, [loadMyOrders]);

  if (loading && !orders.length) return <Loader />;
  if (!orders.length) return <EmptyState icon="📦" title="No orders yet"
    action={<Link to="/customer" className="btn-primary">Start ordering</Link>} />;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <div className="space-y-3">
        {orders.map((o) => <OrderCard key={o.id} order={o} />)}
      </div>
    </div>
  );
};
