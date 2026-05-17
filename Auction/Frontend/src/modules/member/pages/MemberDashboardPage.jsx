import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Gavel, Trophy, Wallet, Activity } from 'lucide-react';
import { useAuthStore } from '../../auth/store/auth.store.js';
import { memberAuctionApi } from '../services/auction.api.js';
import { formatCurrency } from '../../shared/utils/currency.util.js';
import { ROUTES } from '../../shared/constants/routes.constant.js';
import AuctionLiveCard from '../components/AuctionLiveCard.jsx';
import Loader from '../../shared/components/Loader.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';

function Stat({ icon: Icon, label, value, tone }) {
  const toneMap = {
    brand: 'bg-brand-50 text-brand-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
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

export default function MemberDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [live, setLive] = useState([]);
  const [wins, setWins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      memberAuctionApi.getLiveAuctions().catch(() => ({ auctions: [] })),
      memberAuctionApi.myWins().catch(() => ({ auctions: [] })),
    ])
      .then(([l, w]) => {
        setLive(l.auctions || []);
        setWins(w.auctions || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">
          Hello, {user?.name?.split(' ')[0] || 'Bidder'}
        </h1>
        <p className="text-sm text-slate-500">Here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat
          icon={Wallet}
          label="Wallet"
          value={formatCurrency(user?.walletBalance || 0)}
          tone="brand"
        />
        <Stat icon={Activity} label="Live auctions" value={live.length} tone="emerald" />
        <Stat icon={Trophy} label="Wins" value={wins.length} tone="amber" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-700">Live auctions</h2>
          <Link to={ROUTES.MEMBER_AUCTIONS} className="text-xs text-brand-600 hover:underline">
            See all
          </Link>
        </div>
        {loading ? (
          <Loader />
        ) : live.length === 0 ? (
          <EmptyState title="No live auctions right now" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {live.slice(0, 3).map((a) => (
              <AuctionLiveCard key={a.id} auction={a} />
            ))}
          </div>
        )}
      </div>

      <div className="card p-5 flex items-center justify-between bg-gradient-to-r from-brand-600 to-indigo-600 text-white">
        <div>
          <h3 className="font-semibold">Need more bidding power?</h3>
          <p className="text-sm text-white/80">Top up your wallet and keep bidding.</p>
        </div>
        <Link to={ROUTES.MEMBER_WALLET} className="btn bg-white text-brand-700 hover:bg-slate-100">
          <Gavel size={14} /> Manage wallet
        </Link>
      </div>
    </div>
  );
}
