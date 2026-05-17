import { Link } from 'react-router-dom';
import OrderStatusBadge from './OrderStatusBadge.jsx';

export default function OrderCard({ order }) {
  const itemsPreview = order.items?.slice(0, 3) || [];
  const more = (order.items?.length || 0) - itemsPreview.length;

  return (
    <Link to={`/orders/${order._id}`} className="block">
      <div className="card hover:shadow-md transition">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-slate-500">Order ID</p>
            <p className="font-mono text-sm font-semibold">{order._id}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="flex items-center gap-2 mb-3">
          {itemsPreview.map((it, i) => (
            <div key={i} className="h-12 w-12 rounded-lg overflow-hidden bg-slate-100">
              <img
                src={it.image}
                alt={it.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/100x100/EEF2FF/6366F1?text=${encodeURIComponent(it.name?.[0] || '?')}`;
                }}
              />
            </div>
          ))}
          {more > 0 && (
            <span className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600">
              +{more}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="text-xs text-slate-500">
            {order.items?.length || 0} item(s) · {order.payment?.type?.toUpperCase()}
          </div>
          <div className="text-lg font-bold">₹{order.pricing?.total || 0}</div>
        </div>
      </div>
    </Link>
  );
}
