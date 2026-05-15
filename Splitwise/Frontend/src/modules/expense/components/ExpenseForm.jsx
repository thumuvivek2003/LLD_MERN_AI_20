import { useEffect, useMemo, useState } from 'react';
import { Receipt, Wallet } from 'lucide-react';
import Input from '../../../shared/components/Input.jsx';
import Button from '../../../shared/components/Button.jsx';
import SplitTypeSelector from './SplitTypeSelector.jsx';
import ParticipantSelector from './ParticipantSelector.jsx';
import { getSplitFormComponent } from '../strategies/SplitStrategyFactory.js';
import Avatar from '../../../shared/components/Avatar.jsx';
import {
  validatePercentSum,
  validateSplitSum
} from '../../../shared/utils/split.util.js';

export default function ExpenseForm({ members = [], initial, onSubmit, submitting }) {
  const activeMembers = useMemo(
    () => members.filter((m) => m.status === 'ACTIVE'),
    [members]
  );
  const memberIds = useMemo(() => activeMembers.map((m) => m.userId), [activeMembers]);

  const [description, setDescription] = useState(initial?.description || '');
  const [amount, setAmount] = useState(
    initial?.amount != null ? String(initial.amount) : ''
  );
  const [paidBy, setPaidBy] = useState(initial?.paidBy || memberIds[0] || '');
  const [splitType, setSplitType] = useState(initial?.splitType || 'EQUAL');
  const [participants, setParticipants] = useState(initial?.participants || memberIds);
  const [exactAmounts, setExactAmounts] = useState(() => {
    if (initial?.splitType === 'EXACT' && initial?.shares) {
      return Object.fromEntries(initial.shares.map((s) => [s.userId, s.amount]));
    }
    return {};
  });
  const [percents, setPercents] = useState(() => {
    if (initial?.splitType === 'PERCENT' && initial?.shares && initial?.amount) {
      return Object.fromEntries(
        initial.shares.map((s) => [
          s.userId,
          Math.round((s.amount / initial.amount) * 10000) / 100
        ])
      );
    }
    return {};
  });

  // When participants change, prune split inputs for removed users
  useEffect(() => {
    setExactAmounts((prev) =>
      Object.fromEntries(Object.entries(prev).filter(([uid]) => participants.includes(uid)))
    );
    setPercents((prev) =>
      Object.fromEntries(Object.entries(prev).filter(([uid]) => participants.includes(uid)))
    );
  }, [participants]);

  const numericAmount = Number(amount) || 0;

  const splitValid = (() => {
    if (participants.length === 0) return false;
    if (numericAmount <= 0) return false;
    if (splitType === 'EQUAL') return true;
    if (splitType === 'EXACT')
      return validateSplitSum(
        numericAmount,
        Object.fromEntries(participants.map((uid) => [uid, exactAmounts[uid] ?? 0]))
      );
    if (splitType === 'PERCENT')
      return validatePercentSum(
        Object.fromEntries(participants.map((uid) => [uid, percents[uid] ?? 0]))
      );
    return false;
  })();

  const canSubmit =
    description.trim().length > 0 &&
    numericAmount > 0 &&
    paidBy &&
    participants.length > 0 &&
    splitValid;

  const toggleParticipant = (uid) => {
    setParticipants((prev) =>
      prev.includes(uid) ? prev.filter((x) => x !== uid) : [...prev, uid]
    );
  };

  const SplitFormComponent = getSplitFormComponent(splitType);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const payload = {
      description: description.trim(),
      amount: numericAmount,
      paidBy,
      splitType,
      participants
    };

    if (splitType === 'EXACT') {
      payload.splitInput = {
        amounts: Object.fromEntries(
          participants.map((uid) => [uid, Number(exactAmounts[uid] ?? 0)])
        )
      };
    } else if (splitType === 'PERCENT') {
      payload.splitInput = {
        percents: Object.fromEntries(
          participants.map((uid) => [uid, Number(percents[uid] ?? 0)])
        )
      };
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100 space-y-4">
        <Input
          label="Description"
          placeholder="Dinner at Cafe"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          leftAddon={<Receipt className="w-4 h-4" />}
          required
        />
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

        <div>
          <span className="block text-sm font-medium text-slate-700 mb-1.5">Paid by</span>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {activeMembers.map((m) => {
              const active = paidBy === m.userId;
              return (
                <button
                  key={m.userId}
                  type="button"
                  onClick={() => setPaidBy(m.userId)}
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
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100 space-y-4">
        <div>
          <span className="block text-sm font-medium text-slate-700 mb-1.5">Split</span>
          <SplitTypeSelector value={splitType} onChange={setSplitType} />
        </div>

        <div>
          <span className="block text-sm font-medium text-slate-700 mb-1.5">Participants</span>
          <ParticipantSelector
            members={activeMembers}
            selected={participants}
            onToggle={toggleParticipant}
          />
        </div>

        {participants.length > 0 && numericAmount > 0 && (
          <div>
            <span className="block text-sm font-medium text-slate-700 mb-1.5">Breakdown</span>
            {splitType === 'EQUAL' && (
              <SplitFormComponent
                amount={numericAmount}
                participants={participants}
                members={activeMembers}
              />
            )}
            {splitType === 'EXACT' && (
              <SplitFormComponent
                amount={numericAmount}
                participants={participants}
                members={activeMembers}
                values={exactAmounts}
                onChange={setExactAmounts}
              />
            )}
            {splitType === 'PERCENT' && (
              <SplitFormComponent
                amount={numericAmount}
                participants={participants}
                members={activeMembers}
                values={percents}
                onChange={setPercents}
              />
            )}
          </div>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={!canSubmit || submitting}
      >
        <Wallet className="w-5 h-5" />
        {submitting ? 'Saving...' : 'Save expense'}
      </Button>
    </form>
  );
}
