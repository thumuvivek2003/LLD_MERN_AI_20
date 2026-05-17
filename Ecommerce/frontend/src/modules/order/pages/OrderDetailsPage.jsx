import { useParams, Link } from 'react-router-dom';
import PageHeader from '../../../shared/components/PageHeader.jsx';
import Loader from '../../../shared/components/Loader.jsx';
import OrderTimeline from '../components/OrderTimeline.jsx';
import OrderItemList from '../components/OrderItemList.jsx';
import OrderStatusBadge from '../components/OrderStatusBadge.jsx';
import PriceBreakdown from '../../checkout/components/PriceBreakdown.jsx';
import { useOrderDetails } from '../hooks/useOrders.js';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { order, loading, error } = useOrderDetails(id);

  if (loading) return <Loader full />;
  if (error || !order) {
    return (
      <div className="card">
        <p className="text-red-500">{error || 'Order not found'}</p>
        <Link to="/orders" className="text-brand font-semibold mt-2 inline-block">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/orders" className="text-sm text-slate-500 hover:text-brand mb-4 inline-block">
        ← Back to orders
      </Link>
      <PageHeader
        title="Order Details"
        subtitle={`Order ID: ${order._id}`}
        actions={<OrderStatusBadge status={order.status} />}
      />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
          <OrderTimeline status={order.status} />
          <OrderItemList items={order.items} />
        </div>
        <div className="space-y-6">
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
