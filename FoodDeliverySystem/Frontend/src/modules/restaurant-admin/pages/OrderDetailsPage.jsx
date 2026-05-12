import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as api from '../services/restaurant-admin.api.js';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { StatusBadge } from '../../../shared/components/ui/Badge.jsx';
import { formatCurrency } from '../../../core/utils/currency.util.js';
import { formatDate } from '../../../core/utils/date.util.js';
import { ORDER_STATUS } from '../../../core/constants/order-status.constants.js';

export const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => { api.getOrder(id).then((r) => setOrder(r.data)); }, [id]);
  if (!order) return <Loader />;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Order #{order.id.slice(-6)}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="card p-5 mb-4 space-y-2">
        <h3 className="font-semibold">Items</h3>
        {order.items.map((i, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span>{i.name} × {i.quantity}</span>
            <span>{formatCurrency(i.price * i.quantity)}</span>
          </div>
        ))}
        <div className="border-t pt-2 flex justify-between font-bold">
          <span>Total</span><span>{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>

      <div className="card p-5 mb-4 text-sm">
        <div>📍 {order.deliveryAddress}</div>
        <div>💳 Paid via {order.paymentMethod}</div>
        <div>🕒 {formatDate(order.createdAt)}</div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Link to={`/restaurant/orders/${order.id}/status`} className="btn-primary">Update Status</Link>
        {order.status === ORDER_STATUS.READY_FOR_PICKUP && !order.deliveryPartnerId && (
          <Link to={`/restaurant/orders/${order.id}/assign`} className="btn-outline">Assign Delivery</Link>
        )}
      </div>
    </div>
  );
};
