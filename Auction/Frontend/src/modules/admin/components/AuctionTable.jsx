import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { formatCurrency } from '../../shared/utils/currency.util.js';
import { formatDate } from '../../shared/utils/timer.util.js';
import StatusBadge from './StatusBadge.jsx';
import { ROUTES } from '../../shared/constants/routes.constant.js';

export default function AuctionTable({ auctions = [] }) {
  if (!auctions.length) {
    return (
      <div className="card p-10 text-center text-sm text-slate-500">
        No auctions yet.
      </div>
    );
  }
  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
          <tr>
            <th className="text-left px-4 py-3">Item</th>
            <th className="text-left px-4 py-3">Status</th>
            <th className="text-right px-4 py-3">Start</th>
            <th className="text-right px-4 py-3">Current</th>
            <th className="text-left px-4 py-3">Ends</th>
            <th className="text-right px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {auctions.map((a) => (
            <tr key={a.id} className="border-t border-slate-100 hover:bg-slate-50">
              <td className="px-4 py-3">
                <div className="font-medium text-slate-800">{a.item?.name}</div>
                <div className="text-xs text-slate-500">
                  {a.eligibleUserIds?.length || 0} eligible bidders
                </div>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={a.status} />
              </td>
              <td className="px-4 py-3 text-right">{formatCurrency(a.startPrice)}</td>
              <td className="px-4 py-3 text-right font-semibold">
                {formatCurrency(a.currentHighestBid || a.startPrice)}
              </td>
              <td className="px-4 py-3 text-xs text-slate-500">{formatDate(a.endTime)}</td>
              <td className="px-4 py-3 text-right">
                <Link
                  to={ROUTES.ADMIN_AUCTION_DETAILS(a.id)}
                  className="inline-flex items-center gap-1 text-brand-600 hover:underline"
                >
                  <Eye size={14} /> View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
