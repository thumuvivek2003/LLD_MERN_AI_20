import { ArrowRight } from 'lucide-react';
import Avatar from '../../../shared/components/Avatar.jsx';
import { formatCurrency } from '../../../shared/utils/format.js';

export default function DebtCard({ debt }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 shadow-soft">
      <div className="flex items-center gap-2 min-w-0">
        <Avatar name={debt.fromName} size="sm" />
        <span className="text-sm font-medium text-slate-700 truncate">{debt.fromName}</span>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Avatar name={debt.toName} size="sm" />
        <span className="text-sm font-medium text-slate-700 truncate">{debt.toName}</span>
      </div>
      <span className="text-sm font-bold text-brand-600 whitespace-nowrap">
        {formatCurrency(debt.amount)}
      </span>
    </div>
  );
}
