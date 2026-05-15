import { Crown, UserMinus } from 'lucide-react';
import Avatar from '../../../shared/components/Avatar.jsx';

export default function MemberCard({ member, isYou, canRemove, onRemove }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 shadow-soft">
      <Avatar name={member.name} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <div className="font-semibold text-slate-800 truncate">{member.name}</div>
          {isYou && (
            <span className="text-[10px] uppercase font-semibold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-md">
              you
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          {member.role === 'CREATOR' && (
            <span className="flex items-center gap-1 text-xs text-amber-600">
              <Crown className="w-3 h-3" /> creator
            </span>
          )}
          <span
            className={`text-xs ${
              member.status === 'ACTIVE' ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            {member.status === 'ACTIVE' ? 'active' : 'left'}
          </span>
        </div>
      </div>
      {canRemove && member.status === 'ACTIVE' && (
        <button
          onClick={onRemove}
          className="p-2 rounded-lg text-rose-500 hover:bg-rose-50"
          aria-label="Remove member"
        >
          <UserMinus className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
