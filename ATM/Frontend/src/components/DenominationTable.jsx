export default function DenominationTable({ breakdown = [], total = 0 }) {
  const rows = (breakdown || []).filter((r) => r && r.count > 0);

  const formatINR = (n) =>
    new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n || 0);

  return (
    <div className="rounded-xl border border-atmborder bg-atmpanel/60 overflow-hidden">
      <div className="grid grid-cols-3 px-4 py-2.5 text-xs uppercase tracking-wider text-slate-400 border-b border-atmborder">
        <span>Denomination</span>
        <span className="text-center">Count</span>
        <span className="text-right">Amount</span>
      </div>
      <div className="divide-y divide-atmborder">
        {rows.length === 0 && (
          <div className="px-4 py-4 text-sm text-slate-400 text-center">
            No breakdown available
          </div>
        )}
        {rows.map((r) => (
          <div
            key={r.denomination}
            className="grid grid-cols-3 px-4 py-2.5 text-sm text-slate-200"
          >
            <span className="font-medium">₹{formatINR(r.denomination)}</span>
            <span className="text-center tabular-nums">× {r.count}</span>
            <span className="text-right tabular-nums">
              ₹{formatINR(r.denomination * r.count)}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-atmborder px-4 py-3 bg-atmcard/50">
        <span className="text-sm text-slate-300">Total Amount</span>
        <span className="text-lg font-bold text-atmaccent tabular-nums">
          ₹{formatINR(total)}
        </span>
      </div>
    </div>
  );
}
