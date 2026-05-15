import MemberCard from './MemberCard.jsx';

export default function MemberList({ members = [], activeUserId, canManage, onRemove }) {
  return (
    <div className="space-y-2">
      {members.map((m) => (
        <MemberCard
          key={m.userId}
          member={m}
          isYou={m.userId === activeUserId}
          canRemove={canManage && m.userId !== activeUserId}
          onRemove={() => onRemove?.(m)}
        />
      ))}
    </div>
  );
}
