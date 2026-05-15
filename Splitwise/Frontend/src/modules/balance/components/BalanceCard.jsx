import Avatar from '../../../shared/components/Avatar.jsx';
import { formatCurrency } from '../../../shared/utils/format.js';

export default function BalanceCard({ balance, isYou }) {
  const positive = balance.netAmount > 0;
  const negative = balance.netAmount < 0;
  const zero = !positive && !negative;
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 shadow-soft">
      <Avatar name={balance.name} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <div className="font-semibold text-slate-800 truncate">{balance.name}</div>
          {isYou && (
            <span className="text-[10px] uppercase font-semibold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-md">
              you
            </span>
          )}
        </div>
        <div
          className={`text-xs mt-0.5 ${
            positive ? 'text-emerald-600' : negative ? 'text-rose-500' : 'text-slate-400'
          }`}
        >
          {zero ? 'all settled' : positive ? 'is owed' : 'owes'}
        </div>
      </div>
      <div
        className={`text-sm font-bold whitespace-nowrap ${
          positive ? 'text-emerald-600' : negative ? 'text-rose-500' : 'text-slate-400'
        }`}
      >
        {formatCurrency(Math.abs(balance.netAmount))}
      </div>
    </div>
  );
}
