import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRestaurantOrders } from '../hooks/useRestaurantOrders.js';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { OrderCard } from '../../../shared/components/cards/OrderCard.jsx';
import { EmptyState } from '../../../shared/components/ui/EmptyState.jsx';
import { ORDER_STATUS_LABEL } from '../../../core/constants/order-status.constants.js';

const FILTERS = ['ALL', 'PAID', 'RESTAURANT_ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

export const IncomingOrdersPage = () => {
  const { restaurant, orders, loading, loadOrders } = useRestaurantOrders();
  const [filter, setFilter] = useState('PAID');

  useEffect(() => { if (restaurant) loadOrders(filter === 'ALL' ? undefined : filter); }, [restaurant, filter, loadOrders]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Incoming Orders</h1>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {FILTERS.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-sm border whitespace-nowrap ${filter === s ? 'bg-brand text-white border-brand' : 'bg-white text-gray-700 border-gray-200'}`}>
            {s === 'ALL' ? 'All' : ORDER_STATUS_LABEL[s]}
          </button>
        ))}
      </div>
      {loading ? <Loader /> :
        orders.length === 0 ? <EmptyState icon="📭" title="No orders here" /> :
        <div className="grid md:grid-cols-2 gap-3">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} linkPrefix="/restaurant/orders"
              actions={
                <>
                  <Link to={`/restaurant/orders/${o.id}`} className="btn-outline text-sm px-3 py-1.5">View</Link>
                  <Link to={`/restaurant/orders/${o.id}/status`} className="btn-primary text-sm px-3 py-1.5">Update</Link>
                </>
              }
            />
          ))}
        </div>
      }
    </div>
  );
};
