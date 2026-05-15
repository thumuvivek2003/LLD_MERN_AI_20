import Avatar from '../../../shared/components/Avatar.jsx';
import { sumValues, validateSplitSum } from '../../../shared/utils/split.util.js';
import { formatCurrency } from '../../../shared/utils/format.js';

export default function ExactSplitForm({ amount, participants, members, values, onChange }) {
  const total = Number(amount) || 0;
  const sum = sumValues(values);
  const remaining = total - sum;
  const ok = validateSplitSum(total, values);
  return (
    <div className="bg-brand-50/60 rounded-2xl p-3 space-y-3">
      {participants.map((uid) => {
        const m = members.find((x) => x.userId === uid);
        return (
          <div key={uid} className="flex items-center gap-3">
            <Avatar name={m?.name} size="sm" />
            <span className="flex-1 text-sm text-slate-700 truncate">{m?.name}</span>
            <span className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2 py-1">
              <span className="text-slate-400 text-sm">₹</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={values[uid] ?? ''}
                onChange={(e) =>
                  onChange({ ...values, [uid]: e.target.value === '' ? '' : Number(e.target.value) })
                }
                className="w-24 outline-none text-sm text-right"
              />
            </span>
          </div>
        );
      })}
      <div className="flex items-center justify-between text-xs pt-2 border-t border-brand-100">
        <span className="text-slate-500">Total entered: {formatCurrency(sum)}</span>
        <span
          className={`font-semibold ${
            ok ? 'text-emerald-600' : remaining > 0 ? 'text-amber-600' : 'text-rose-500'
          }`}
        >
          {ok ? 'matches amount' : `${formatCurrency(remaining)} left`}
        </span>
      </div>
    </div>
  );
}
