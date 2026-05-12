import { useDeliveryOrders } from '../hooks/useDeliveryOrders.js';
import { Link } from 'react-router-dom';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { EmptyState } from '../../../shared/components/ui/EmptyState.jsx';
import { DeliveryCard } from '../../../shared/components/cards/DeliveryCard.jsx';

export const OngoingDeliveryPage = () => {
  const { orders, loading } = useDeliveryOrders('OUT_FOR_DELIVERY');

  if (loading) return <Loader />;
  if (!orders.length) return <EmptyState icon="🛵" title="No ongoing deliveries" />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Ongoing Deliveries</h1>
      <div className="grid md:grid-cols-2 gap-3">
        {orders.map((o) => (
          <DeliveryCard key={o.id} order={o} actions={
            <Link to={`/delivery/otp/${o.id}`} className="btn-primary text-sm px-3 py-1.5">Verify & Deliver</Link>
          }/>
        ))}
      </div>
    </div>
  );
};
