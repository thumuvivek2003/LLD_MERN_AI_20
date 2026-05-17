export default function OrderItemList({ items = [] }) {
  return (
    <div className="card">
      <h3 className="text-lg font-bold text-slate-900 mb-3">Items</h3>
      <div className="divide-y divide-slate-100">
        {items.map((it) => (
          <div key={it.productId} className="flex items-center gap-4 py-3">
            <div className="h-16 w-16 rounded-xl overflow-hidden bg-slate-100">
              <img
                src={it.image}
                alt={it.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/200x200/EEF2FF/6366F1?text=${encodeURIComponent(it.name)}`;
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 truncate">{it.name}</p>
              <p className="text-sm text-slate-500">
                ₹{it.price} × {it.quantity}
              </p>
            </div>
            <p className="font-bold text-slate-900">₹{it.subtotal}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
