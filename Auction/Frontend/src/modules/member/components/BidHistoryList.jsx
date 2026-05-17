import { formatCurrency } from '../../shared/utils/currency.util.js';
import { formatDate } from '../../shared/utils/timer.util.js';

export default function BidHistoryList({ bids = [], emptyLabel = 'No bids yet.' }) {
  if (!bids.length) {
    return <p className="text-sm text-slate-400">{emptyLabel}</p>;
  }
  return (
    <ul className="divide-y divide-slate-100">
      {bids.map((b) => (
        <li
          key={b.id}
          className="py-2 grid grid-cols-3 items-center text-sm"
        >
          <span className="text-slate-700 truncate">{b.bidderName}</span>
          <span className="text-center font-semibold text-slate-800">
            {formatCurrency(b.amount)}
          </span>
          <span className="text-right text-xs text-slate-400">
            {formatDate(b.timestamp)}
          </span>
        </li>
      ))}
    </ul>
  );
}
