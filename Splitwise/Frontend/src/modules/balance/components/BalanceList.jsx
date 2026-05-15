import BalanceCard from './BalanceCard.jsx';

export default function BalanceList({ balances = [], activeUserId }) {
  return (
    <div className="space-y-2">
      {balances.map((b) => (
        <BalanceCard key={b.userId} balance={b} isYou={b.userId === activeUserId} />
      ))}
    </div>
  );
}
