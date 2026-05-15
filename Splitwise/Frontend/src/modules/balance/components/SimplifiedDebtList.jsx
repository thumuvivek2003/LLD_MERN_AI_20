import DebtCard from './DebtCard.jsx';

export default function SimplifiedDebtList({ debts = [] }) {
  return (
    <div className="space-y-2">
      {debts.map((d, i) => (
        <DebtCard key={`${d.fromUserId}-${d.toUserId}-${i}`} debt={d} />
      ))}
    </div>
  );
}
