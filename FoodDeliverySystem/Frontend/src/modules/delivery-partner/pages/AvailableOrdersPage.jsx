import { useDeliveryOrders } from '../hooks/useDeliveryOrders.js';
import { Link } from 'react-router-dom';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { EmptyState } from '../../../shared/components/ui/EmptyState.jsx';
import { DeliveryCard } from '../../../shared/components/cards/DeliveryCard.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import * as api from '../services/delivery.api.js';
import { showSuccessToast, showErrorToast } from '../../../core/services/notification.service.js';

export const AvailableOrdersPage = () => {
  const { orders, loading, refresh } = useDeliveryOrders('READY_FOR_PICKUP');

  const accept = async (id) => {
    try { await api.acceptDelivery(id); showSuccessToast('Accepted'); await refresh(); }
    catch (e) { showErrorToast(e.message); }
  };
  const reject = async (id) => {
    try { await api.rejectDelivery(id); showSuccessToast('Rejected'); await refresh(); }
    catch (e) { showErrorToast(e.message); }
  };

  if (loading) return <Loader />;
  if (!orders.length) return <EmptyState icon="🆕" title="No new tasks" subtitle="Stay online to receive new tasks" />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Available Tasks</h1>
      <div className="grid md:grid-cols-2 gap-3">
        {orders.map((o) => (
          <DeliveryCard key={o.id} order={o} actions={
            <>
              <Link to={`/delivery/pickup/${o.id}`} className="btn-outline text-sm px-3 py-1.5">View</Link>
              <Button size="sm" variant="primary" onClick={() => accept(o.id)}>Accept</Button>
              <Button size="sm" variant="outline" onClick={() => reject(o.id)}>Reject</Button>
            </>
          } />
        ))}
      </div>
    </div>
  );
};
