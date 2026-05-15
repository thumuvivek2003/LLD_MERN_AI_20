import { Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../../shared/utils/format.js';

export default function GroupCard({ group, netAmount = 0 }) {
  const navigate = useNavigate();
  const activeMembers = (group.members || []).filter((m) => m.status === 'ACTIVE');
  const positive = netAmount > 0;
  const negative = netAmount < 0;

  return (
    <button
      onClick={() => navigate(`/groups/${group.groupId}`)}
      className="text-left w-full bg-white rounded-2xl border border-slate-100 shadow-soft hover:shadow-card transition-all p-4 group"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
          <Users className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-slate-800 truncate">{group.name}</h3>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 transition-colors" />
          </div>
          {group.description && (
            <p className="text-xs text-slate-500 truncate mt-0.5">{group.description}</p>
          )}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-slate-500">{activeMembers.length} members</span>
            {netAmount === 0 ? (
              <span className="text-xs font-semibold text-slate-400">settled</span>
            ) : (
              <span
                className={`text-xs font-semibold ${
                  positive ? 'text-emerald-600' : negative ? 'text-rose-500' : 'text-slate-500'
                }`}
              >
                {positive ? 'you are owed ' : 'you owe '}
                {formatCurrency(Math.abs(netAmount))}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
