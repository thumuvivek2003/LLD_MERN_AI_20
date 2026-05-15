import { Pencil, Trash2, Receipt } from 'lucide-react';
import Avatar from '../../../shared/components/Avatar.jsx';
import { formatCurrency, formatDate } from '../../../shared/utils/format.js';

export default function ExpenseCard({
  expense,
  members = [],
  activeUserId,
  onEdit,
  onDelete
}) {
  const payer = members.find((m) => m.userId === expense.paidBy);
  const isYouPaid = expense.paidBy === activeUserId;
  const yourShare = (expense.shares || []).find((s) => s.userId === activeUserId)?.amount || 0;
  const youOwe = !isYouPaid && yourShare > 0 ? yourShare : 0;
  const youLent = isYouPaid ? expense.amount - yourShare : 0;

  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-soft">
      <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
        <Receipt className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-slate-800 truncate">{expense.description}</h3>
          <span className="text-sm font-bold text-slate-800 whitespace-nowrap">
            {formatCurrency(expense.amount)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
            <Avatar name={payer?.name || '?'} size="sm" className="w-5 h-5 text-[10px]" />
            <span className="truncate">
              {isYouPaid ? 'You' : payer?.name || 'someone'} paid · {formatDate(expense.createdAt)}
            </span>
          </div>
          {youOwe > 0 && (
            <span className="text-xs font-semibold text-rose-500 whitespace-nowrap">
              you owe {formatCurrency(youOwe)}
            </span>
          )}
          {youLent > 0 && (
            <span className="text-xs font-semibold text-emerald-600 whitespace-nowrap">
              you lent {formatCurrency(youLent)}
            </span>
          )}
        </div>
      </div>
      {(onEdit || onDelete) && (
        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 rounded-lg text-slate-500 hover:bg-brand-50 hover:text-brand-600"
              aria-label="Edit"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-2 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-500"
              aria-label="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
