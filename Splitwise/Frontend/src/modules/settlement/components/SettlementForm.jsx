import { useMemo, useState } from 'react';
import { HandCoins, ArrowRight } from 'lucide-react';
import Button from '../../../shared/components/Button.jsx';
import Input from '../../../shared/components/Input.jsx';
import Avatar from '../../../shared/components/Avatar.jsx';

function MemberPicker({ members, value, onChange, exclude }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {members
        .filter((m) => m.userId !== exclude)
        .map((m) => {
          const active = value === m.userId;
          return (
            <button
              key={m.userId}
              type="button"
              onClick={() => onChange(m.userId)}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl border whitespace-nowrap transition-colors ${
                active
                  ? 'border-brand-400 bg-brand-50 text-brand-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-brand-200'
              }`}
            >
              <Avatar name={m.name} size="sm" className="w-6 h-6 text-[10px]" />
              <span className="text-sm font-medium">{m.name}</span>
            </button>
          );
        })}
    </div>
  );
}

export default function SettlementForm({
  members = [],
  defaultFromUserId,
  onSubmit,
  submitting
}) {
  const active = useMemo(() => members.filter((m) => m.status === 'ACTIVE'), [members]);
  const [fromUserId, setFromUserId] = useState(defaultFromUserId || active[0]?.userId || '');
  const [toUserId, setToUserId] = useState(
    active.find((m) => m.userId !== (defaultFromUserId || active[0]?.userId))?.userId || ''
  );
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const numericAmount = Number(amount) || 0;
  const canSubmit = fromUserId && toUserId && fromUserId !== toUserId && numericAmount > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      fromUserId,
      toUserId,
      amount: numericAmount,
      note: note.trim() || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100 space-y-4">
        <div>
          <span className="block text-sm font-medium text-slate-700 mb-1.5">From (payer)</span>
          <MemberPicker
            members={active}
            value={fromUserId}
            onChange={setFromUserId}
            exclude={toUserId}
          />
        </div>
        <div className="flex justify-center text-brand-400">
          <ArrowRight className="w-5 h-5" />
        </div>
        <div>
          <span className="block text-sm font-medium text-slate-700 mb-1.5">To (receiver)</span>
          <MemberPicker
            members={active}
            value={toUserId}
            onChange={setToUserId}
            exclude={fromUserId}
          />
        </div>
        <Input
          label="Amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          leftAddon={<span className="font-semibold">₹</span>}
          required
        />
        <Input
          label="Note (optional)"
          placeholder="e.g. Paid via UPI"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={120}
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={!canSubmit || submitting}>
        <HandCoins className="w-5 h-5" />
        {submitting ? 'Recording...' : 'Record settlement'}
      </Button>
    </form>
  );
}
