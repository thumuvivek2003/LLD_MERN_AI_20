import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { memberAuctionApi } from '../services/auction.api.js';
import Loader from '../../shared/components/Loader.jsx';
import EmptyState from '../../shared/components/EmptyState.jsx';
import { formatCurrency } from '../../shared/utils/currency.util.js';
import { ROUTES } from '../../shared/constants/routes.constant.js';

export default function MyWinsPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    memberAuctionApi
      .myWins()
      .then((d) => setAuctions(d.auctions || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader full />;

  if (!auctions.length)
    return (
      <EmptyState
        title="No wins yet"
        description="Keep bidding — your first win is around the corner."
      />
    );

  return (
    <div className="space-y-4">
      <div className="card p-6 bg-gradient-to-r from-amber-50 to-amber-100 border-amber-100 flex items-center gap-3">
        <Trophy className="text-amber-500" />
        <div>
          <h2 className="font-semibold text-slate-800">Congratulations!</h2>
          <p className="text-sm text-slate-600">You&apos;ve won {auctions.length} auctions.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {auctions.map((a) => (
          <Link
            key={a.id}
            to={ROUTES.MEMBER_AUCTION_DETAILS(a.id)}
            className="card p-4 hover:shadow-md"
          >
            <h4 className="font-medium text-slate-800">{a.item?.name}</h4>
            <p className="mt-2 text-xs text-slate-500">Final price</p>
            <p className="text-lg font-semibold text-emerald-600">
              {formatCurrency(a.currentHighestBid)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
