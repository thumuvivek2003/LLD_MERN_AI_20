import { ArrowRight, HandCoins } from 'lucide-react';
import Avatar from '../../../shared/components/Avatar.jsx';
import { formatCurrency, formatDate } from '../../../shared/utils/format.js';

export default function SettlementCard({ settlement, members = [] }) {
  const from = members.find((m) => m.userId === settlement.fromUserId);
  const to = members.find((m) => m.userId === settlement.toUserId);
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 shadow-soft">
      <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
        <HandCoins className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
          <Avatar name={from?.name || '?'} size="sm" className="w-5 h-5 text-[10px]" />
          <span className="truncate">{from?.name || 'someone'}</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <Avatar name={to?.name || '?'} size="sm" className="w-5 h-5 text-[10px]" />
          <span className="truncate">{to?.name || 'someone'}</span>
        </div>
        <div className="text-xs text-slate-500 mt-0.5">
          {formatDate(settlement.createdAt)}
          {settlement.note ? ` · ${settlement.note}` : ''}
        </div>
      </div>
      <span className="text-sm font-bold text-emerald-600 whitespace-nowrap">
        {formatCurrency(settlement.amount)}
      </span>
    </div>
  );
}
