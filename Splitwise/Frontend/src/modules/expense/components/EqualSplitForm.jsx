import Avatar from '../../../shared/components/Avatar.jsx';
import { calculateEqualSplit } from '../../../shared/utils/split.util.js';
import { formatCurrency } from '../../../shared/utils/format.js';

export default function EqualSplitForm({ amount, participants, members }) {
  const shares = calculateEqualSplit(amount, participants);
  return (
    <div className="bg-brand-50/60 rounded-2xl p-3 space-y-2">
      <p className="text-xs text-slate-500">Each person owes:</p>
      {participants.map((uid) => {
        const m = members.find((x) => x.userId === uid);
        return (
          <div key={uid} className="flex items-center gap-3">
            <Avatar name={m?.name} size="sm" />
            <span className="flex-1 text-sm text-slate-700">{m?.name}</span>
            <span className="text-sm font-semibold text-slate-800">
              {formatCurrency(shares[uid] || 0)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
