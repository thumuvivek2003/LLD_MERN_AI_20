import { useMemo } from 'react';
import { Activity, CalendarClock, Gavel, TrendingUp } from 'lucide-react';
import RevenueChart from '../components/RevenueChart.jsx';
import { useAuctionManagement } from '../hooks/useAuctionManagement.js';
import Loader from '../../shared/components/Loader.jsx';
import { AUCTION_STATUS } from '../../shared/constants/socketEvents.constant.js';
import { formatCurrency } from '../../shared/utils/currency.util.js';
import AuctionCard from '../components/AuctionCard.jsx';

function StatCard({ icon: Icon, label, value, tone = 'brand' }) {
  const toneMap = {
    brand: 'bg-brand-50 text-brand-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    slate: 'bg-slate-100 text-slate-600',
  };
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className={`rounded-lg p-2 ${toneMap[tone]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-xl font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { auctions, loading } = useAuctionManagement(true);

  const stats = useMemo(() => {
    const live = auctions.filter((a) => a.status === AUCTION_STATUS.OPEN).length;
    const scheduled = auctions.filter((a) => a.status === AUCTION_STATUS.SCHEDULED).length;
    const closed = auctions.filter((a) => a.status === AUCTION_STATUS.CLOSED);
    const revenue = closed.reduce((sum, a) => sum + (a.currentHighestBid || 0), 0);
    return { live, scheduled, closedCount: closed.length, revenue };
  }, [auctions]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500">Overview of auction activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Activity} label="Live auctions" value={stats.live} tone="emerald" />
        <StatCard icon={CalendarClock} label="Scheduled" value={stats.scheduled} tone="amber" />
        <StatCard icon={Gavel} label="Closed" value={stats.closedCount} tone="slate" />
        <StatCard
          icon={TrendingUp}
          label="Revenue"
          value={formatCurrency(stats.revenue)}
          tone="brand"
        />
      </div>

      <RevenueChart />

      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Recent auctions</h2>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {auctions.slice(0, 6).map((a) => (
              <AuctionCard key={a.id} auction={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
