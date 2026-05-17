import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../../../shared/components/PageHeader.jsx';
import Loader from '../../../../shared/components/Loader.jsx';
import OrderStatusBadge from '../../../order/components/OrderStatusBadge.jsx';
import OrderItemList from '../../../order/components/OrderItemList.jsx';
import OrderTimeline from '../../../order/components/OrderTimeline.jsx';
import PriceBreakdown from '../../../checkout/components/PriceBreakdown.jsx';
import OrderStatusDropdown from '../components/OrderStatusDropdown.jsx';
import { getOrderById, updateOrderStatus } from '../services/adminOrders.service.js';

export default function AdminOrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getOrderById(id);
      setOrder(data.order);
      setCustomer(data.customer);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function handleStatusChange(orderId, status) {
    setAction(true);
    setError('');
    try {
      await updateOrderStatus(orderId, status);
      await fetchAll();
    } catch (e) {
      setError(e.message);
    } finally {
      setAction(false);
    }
  }

  if (loading) return <Loader full />;

  if (!order) {
    return (
      <div className="card">
        <p className="text-red-500">{error || 'Order not found'}</p>
        <Link to="/admin/orders" className="text-brand font-semibold mt-2 inline-block">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/admin/orders" className="text-sm text-slate-500 hover:text-brand mb-4 inline-block">
        ← Back to orders
      </Link>
      <PageHeader
        title="Order Details"
        subtitle={`Order ID: ${order._id}`}
        actions={<OrderStatusBadge status={order.status} />}
      />
      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
          <OrderItemList items={order.items} />
          <OrderTimeline status={order.status} />
        </div>
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Customer</h3>
            {customer ? (
              <div className="space-y-1">
                <p className="font-semibold text-slate-800">{customer.name}</p>
                <p className="text-sm text-slate-500">{customer.email}</p>
                <Link
                  to={`/admin/users/${customer._id}`}
                  className="inline-block mt-2 text-sm font-semibold text-brand hover:underline"
                >
                  View customer →
                </Link>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Customer info unavailable.</p>
            )}
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Update Status</h3>
            <OrderStatusDropdown order={order} loading={action} onChange={handleStatusChange} />
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Delivery Address</h3>
            <p className="text-slate-700 text-sm">{order.address?.line1}</p>
            <p className="text-slate-700 text-sm">
              {order.address?.city} — {order.address?.pincode}
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Payment</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">Method</span>
              <span className="font-semibold uppercase">{order.payment?.type}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">Status</span>
              <span className="font-semibold capitalize">{order.payment?.status}</span>
            </div>
            {order.payment?.transactionId && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Txn ID</span>
                <span className="font-mono text-xs">{order.payment.transactionId}</span>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Price Details</h3>
            <PriceBreakdown pricing={order.pricing} />
          </div>
        </div>
      </div>
    </div>
  );
}
