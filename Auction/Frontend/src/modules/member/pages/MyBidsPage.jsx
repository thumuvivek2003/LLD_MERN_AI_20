import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { memberAuctionApi } from '../services/auction.api.js';
import Loader from '../../shared/components/Loader.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import StatusBadge from '../../admin/components/StatusBadge.jsx';
import { formatCurrency } from '../../shared/utils/currency.util.js';
import { ROUTES } from '../../shared/constants/routes.constant.js';

export default function MyBidsPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    memberAuctionApi
      .myBids()
      .then((d) => setAuctions(d.auctions || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader full />;
  if (!auctions.length)
    return <EmptyState title="No bids yet" description="Join a live auction to get started." />;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-800">My bids</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {auctions.map((a) => (
          <Link
            key={a.id}
            to={ROUTES.MEMBER_AUCTION_DETAILS(a.id)}
            className="card p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-slate-800">{a.item?.name}</h4>
              <StatusBadge status={a.status} />
            </div>
            <p className="mt-2 text-xs text-slate-500">Current high</p>
            <p className="text-lg font-semibold text-slate-800">
              {formatCurrency(a.currentHighestBid || a.startPrice)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
