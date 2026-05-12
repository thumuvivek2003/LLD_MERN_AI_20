import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../services/restaurant-admin.api.js';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { StatusBadge } from '../../../shared/components/ui/Badge.jsx';
import { ORDER_STATUS, ORDER_STATUS_LABEL } from '../../../core/constants/order-status.constants.js';
import { showSuccessToast, showErrorToast } from '../../../core/services/notification.service.js';

const NEXT_BY_STATUS = {
  [ORDER_STATUS.PAID]: [ORDER_STATUS.RESTAURANT_ACCEPTED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.RESTAURANT_ACCEPTED]: [ORDER_STATUS.PREPARING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PREPARING]: [ORDER_STATUS.READY_FOR_PICKUP, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.READY_FOR_PICKUP]: [],
};

export const OrderStatusPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  const load = async () => { const r = await api.getOrder(id); setOrder(r.data); };
  useEffect(() => { load(); }, [id]);

  const transition = async (next) => {
    try {
      await api.updateOrderStatus(id, next);
      showSuccessToast(`Status → ${ORDER_STATUS_LABEL[next]}`);
      await load();
      if (next === ORDER_STATUS.READY_FOR_PICKUP) navigate(`/restaurant/orders/${id}/assign`);
    } catch (e) { showErrorToast(e.message); }
  };

  if (!order) return <Loader />;
  const next = NEXT_BY_STATUS[order.status] || [];

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-3">Update Order #{order.id.slice(-6)}</h1>
      <div className="card p-5">
        <div className="mb-4">Current: <StatusBadge status={order.status} /></div>
        {next.length === 0 ? (
          <div className="text-gray-500 text-sm">No further transitions allowed from this state.</div>
        ) : (
          <div className="flex flex-col gap-2">
            {next.map((s) => (
              <Button key={s} variant={s === ORDER_STATUS.CANCELLED ? 'danger' : 'primary'} onClick={() => transition(s)}>
                Mark as {ORDER_STATUS_LABEL[s]}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
