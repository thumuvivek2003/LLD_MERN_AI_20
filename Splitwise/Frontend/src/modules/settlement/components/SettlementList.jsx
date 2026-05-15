import SettlementCard from './SettlementCard.jsx';

export default function SettlementList({ settlements = [], members }) {
  return (
    <div className="space-y-2">
      {settlements.map((s) => (
        <SettlementCard key={s.settlementId} settlement={s} members={members} />
      ))}
    </div>
  );
}
