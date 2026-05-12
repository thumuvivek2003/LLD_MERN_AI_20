import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById, cancelOrder } from '../services/customer.api.js';
import { Loader } from '../../../shared/components/ui/Loader.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { StatusBadge } from '../../../shared/components/ui/Badge.jsx';
import { formatCurrency } from '../../../core/utils/currency.util.js';
import { formatDate } from '../../../core/utils/date.util.js';
import { ORDER_STATUS, ORDER_STATUS_LABEL } from '../../../core/constants/order-status.constants.js';
import { showSuccessToast, showErrorToast } from '../../../core/services/notification.service.js';

const TIMELINE = [
  ORDER_STATUS.CREATED,
  ORDER_STATUS.PAID,
  ORDER_STATUS.RESTAURANT_ACCEPTED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.READY_FOR_PICKUP,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.DELIVERED,
];

export const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const r = await getOrderById(id);
      setOrder(r.data);
    } catch (e) { showErrorToast(e.message); }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
    // eslint-disable-next-line
  }, [id]);

  if (!order) return <Loader />;
  const currentIdx = TIMELINE.indexOf(order.status);
  const isCancellable = [ORDER_STATUS.CREATED, ORDER_STATUS.PAID, ORDER_STATUS.RESTAURANT_ACCEPTED].includes(order.status);

  const handleCancel = async () => {
    setLoading(true);
    try { await cancelOrder(id); showSuccessToast('Order cancelled'); await load(); }
    catch (e) { showErrorToast(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Order #{order.id.slice(-6)}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="card p-5 mb-4">
        <h3 className="font-semibold mb-3">Progress</h3>
        {order.status === ORDER_STATUS.CANCELLED ? (
          <div className="text-red-600">This order was cancelled.</div>
        ) : (
          <div className="space-y-2">
            {TIMELINE.map((s, i) => {
              const reached = currentIdx >= i;
              return (
                <div key={s} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${reached ? 'bg-brand text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {reached ? '✓' : i + 1}
                  </div>
                  <span className={reached ? 'font-medium' : 'text-gray-500'}>{ORDER_STATUS_LABEL[s]}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {order.status === ORDER_STATUS.OUT_FOR_DELIVERY && (
        <Link to={`/customer/otp/${order.id}`} className="card p-4 mb-4 block bg-amber-50 border-amber-200">
          📲 Your delivery OTP has been sent. Tap to view.
        </Link>
      )}

      <div className="card p-5 mb-4">
        <h3 className="font-semibold mb-2">Items</h3>
        <div className="space-y-1 text-sm">
          {order.items.map((i, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{i.name} × {i.quantity}</span>
              <span>{formatCurrency(i.price * i.quantity)}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2 flex justify-between font-bold">
            <span>Total</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-3">
          Placed {formatDate(order.createdAt)} · {order.paymentMethod} · 📍 {order.deliveryAddress}
        </div>
      </div>

      {isCancellable && (
        <Button variant="danger" onClick={handleCancel} disabled={loading}>
          {loading ? 'Cancelling…' : 'Cancel Order'}
        </Button>
      )}
    </div>
  );
};
