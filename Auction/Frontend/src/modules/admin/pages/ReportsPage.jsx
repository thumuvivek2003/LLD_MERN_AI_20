import { useMemo } from 'react';
import RevenueChart from '../components/RevenueChart.jsx';
import { useAuctionManagement } from '../hooks/useAuctionManagement.js';
import { AUCTION_STATUS } from '../../shared/constants/socketEvents.constant.js';
import { formatCurrency } from '../../shared/utils/currency.util.js';

export default function ReportsPage() {
  const { auctions } = useAuctionManagement(true);

  const closed = useMemo(
    () => auctions.filter((a) => a.status === AUCTION_STATUS.CLOSED),
    [auctions]
  );
  const totalRevenue = closed.reduce((s, a) => s + (a.currentHighestBid || 0), 0);
  const avgWinning =
    closed.length === 0
      ? 0
      : Math.round(totalRevenue / closed.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Reports</h1>
        <p className="text-sm text-slate-500">Aggregate auction performance.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-xs text-slate-500">Closed auctions</p>
          <p className="text-xl font-semibold mt-1">{closed.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Total revenue</p>
          <p className="text-xl font-semibold mt-1">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Avg winning bid</p>
          <p className="text-xl font-semibold mt-1">{formatCurrency(avgWinning)}</p>
        </div>
      </div>
      <RevenueChart />
    </div>
  );
}
