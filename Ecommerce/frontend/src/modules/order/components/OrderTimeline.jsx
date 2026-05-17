const STAGES = ['CREATED', 'PAID', 'SHIPPED', 'DELIVERED'];

export default function OrderTimeline({ status }) {
  if (status === 'CANCELLED') {
    return (
      <div className="card">
        <h3 className="text-lg font-bold text-slate-900 mb-3">Order Status</h3>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="font-semibold text-red-600">Order Cancelled</p>
          <p className="text-sm text-red-500 mt-1">This order has been cancelled.</p>
        </div>
      </div>
    );
  }
  const currentIndex = STAGES.indexOf(status);
  return (
    <div className="card">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Order Timeline</h3>
      <div className="relative">
        {STAGES.map((stage, i) => {
          const reached = i <= currentIndex;
          const isLast = i === STAGES.length - 1;
          return (
            <div key={stage} className="flex items-start gap-3 pb-6 last:pb-0 relative">
              {!isLast && (
                <span
                  className={`absolute left-[11px] top-6 w-0.5 h-full ${
                    reached && i < currentIndex ? 'bg-brand' : 'bg-slate-200'
                  }`}
                />
              )}
              <span
                className={`relative z-10 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  reached ? 'bg-brand text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                {reached ? '✓' : i + 1}
              </span>
              <div className={`pt-0.5 ${reached ? 'text-slate-800' : 'text-slate-400'}`}>
                <p className="font-semibold text-sm">{stage}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
