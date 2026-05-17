const STATUS_DOTS = {
  CREATED: 'bg-slate-400',
  PAID: 'bg-blue-500',
  SHIPPED: 'bg-indigo-500',
  DELIVERED: 'bg-green-500',
  CANCELLED: 'bg-red-500',
};

const ORDER = ['CREATED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function OrdersByStatusGrid({ ordersByStatus = {} }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {ORDER.map((s) => (
        <div key={s} className="card flex items-center gap-3 py-3">
          <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOTS[s]}`} />
          <div className="flex-1">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{s}</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{ordersByStatus[s] || 0}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
