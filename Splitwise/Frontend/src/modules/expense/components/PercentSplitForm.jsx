import Avatar from '../../../shared/components/Avatar.jsx';
import { sumValues, validatePercentSum } from '../../../shared/utils/split.util.js';
import { formatCurrency } from '../../../shared/utils/format.js';

export default function PercentSplitForm({ amount, participants, members, values, onChange }) {
  const total = Number(amount) || 0;
  const sum = sumValues(values);
  const ok = validatePercentSum(values);
  const remaining = 100 - sum;
  return (
    <div className="bg-brand-50/60 rounded-2xl p-3 space-y-3">
      {participants.map((uid) => {
        const m = members.find((x) => x.userId === uid);
        const pct = Number(values[uid]) || 0;
        const share = (total * pct) / 100;
        return (
          <div key={uid} className="flex items-center gap-3">
            <Avatar name={m?.name} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-700 truncate">{m?.name}</div>
              <div className="text-xs text-slate-400">≈ {formatCurrency(share)}</div>
            </div>
            <span className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2 py-1">
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={values[uid] ?? ''}
                onChange={(e) =>
                  onChange({ ...values, [uid]: e.target.value === '' ? '' : Number(e.target.value) })
                }
                className="w-20 outline-none text-sm text-right"
              />
              <span className="text-slate-400 text-sm">%</span>
            </span>
          </div>
        );
      })}
      <div className="flex items-center justify-between text-xs pt-2 border-t border-brand-100">
        <span className="text-slate-500">Total: {sum.toFixed(2)}%</span>
        <span
          className={`font-semibold ${
            ok ? 'text-emerald-600' : remaining > 0 ? 'text-amber-600' : 'text-rose-500'
          }`}
        >
          {ok ? 'sums to 100%' : `${remaining.toFixed(2)}% left`}
        </span>
      </div>
    </div>
  );
}
