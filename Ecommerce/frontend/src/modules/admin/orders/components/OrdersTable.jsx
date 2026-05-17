import { Link } from 'react-router-dom';
import OrderStatusBadge from '../../../order/components/OrderStatusBadge.jsx';
import OrderStatusDropdown from './OrderStatusDropdown.jsx';

export default function OrdersTable({ orders, loading, onStatusChange }) {
  return (
    <div className="card overflow-x-auto p-0">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-left text-slate-600">
            <th className="px-4 py-3 font-semibold">Order ID</th>
            <th className="px-4 py-3 font-semibold">Items</th>
            <th className="px-4 py-3 font-semibold">Total</th>
            <th className="px-4 py-3 font-semibold">Payment</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Update</th>
            <th className="px-4 py-3 font-semibold text-right">View</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => (
            <tr key={o._id} className={i % 2 ? 'bg-slate-50/40' : 'bg-white'}>
              <td className="px-4 py-3 font-mono text-xs">{o._id}</td>
              <td className="px-4 py-3">{o.items?.length || 0}</td>
              <td className="px-4 py-3 font-semibold">₹{o.pricing?.total || 0}</td>
              <td className="px-4 py-3 uppercase text-xs font-semibold">{o.payment?.type}</td>
              <td className="px-4 py-3">
                <OrderStatusBadge status={o.status} />
              </td>
              <td className="px-4 py-3 w-44">
                <OrderStatusDropdown order={o} loading={loading} onChange={onStatusChange} />
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  to={`/admin/orders/${o._id}`}
                  className="text-brand text-sm font-semibold hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
