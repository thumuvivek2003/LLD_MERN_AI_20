import { useState } from 'react';
import { useDeliveryOrders } from '../hooks/useDeliveryOrders.js';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { EmptyState } from '../../../shared/components/ui/EmptyState.jsx';
import { DeliveryCard } from '../../../shared/components/cards/DeliveryCard.jsx';
import { ORDER_STATUS_LABEL } from '../../../core/constants/order-status.constants.js';

const FILTERS = ['ALL', 'DELIVERED', 'OUT_FOR_DELIVERY', 'CANCELLED'];

export const DeliveryHistoryPage = () => {
  const [filter, setFilter] = useState('ALL');
  const { orders, loading } = useDeliveryOrders(filter === 'ALL' ? undefined : filter);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">History</h1>
      <div className="flex gap-2 mb-4">
        {FILTERS.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-sm border ${filter === s ? 'bg-brand text-white border-brand' : 'bg-white border-gray-200'}`}>
            {s === 'ALL' ? 'All' : ORDER_STATUS_LABEL[s]}
          </button>
        ))}
      </div>
      {loading ? <Loader /> :
        !orders.length ? <EmptyState icon="📚" title="No deliveries here" /> :
        <div className="grid md:grid-cols-2 gap-3">
          {orders.map((o) => <DeliveryCard key={o.id} order={o} />)}
        </div>
      }
    </div>
  );
};
