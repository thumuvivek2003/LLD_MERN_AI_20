import { Link } from 'react-router-dom';
import PageHeader from '../../../shared/components/PageHeader.jsx';
import Loader from '../../../shared/components/Loader.jsx';
import EmptyState from '../../../shared/components/EmptyState.jsx';
import Button from '../../../shared/components/Button.jsx';
import OrderCard from '../components/OrderCard.jsx';
import { useOrders } from '../hooks/useOrders.js';

export default function OrdersPage() {
  const { orders, loading, error } = useOrders();

  if (loading) return <Loader full />;

  return (
    <div>
      <PageHeader title="My Orders" subtitle={`${orders.length} order(s)`} />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!orders.length ? (
        <EmptyState
          title="No orders yet"
          message="Place your first order to see it here."
          icon="📦"
          action={
            <Link to="/">
              <Button>Start Shopping</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((o) => (
            <OrderCard key={o._id} order={o} />
          ))}
        </div>
      )}
    </div>
  );
}
