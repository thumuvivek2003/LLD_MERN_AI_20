import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLiveAuction } from '../hooks/useLiveAuction.js';
import Loader from '../../shared/components/Loader.jsx';
import LiveBidPanel from '../components/LiveBidPanel.jsx';
import { formatCurrency } from '../../shared/utils/currency.util.js';
import { ROUTES } from '../../shared/constants/routes.constant.js';

export default function PlaceBidPage() {
  const { id } = useParams();
  const { auction } = useLiveAuction(id);

  if (!auction) return <Loader full />;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Link
        to={ROUTES.MEMBER_AUCTION_DETAILS(id)}
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft size={14} /> Back to auction
      </Link>

      <div className="card p-5">
        <p className="text-xs text-slate-500">You are bidding on</p>
        <h1 className="text-xl font-semibold text-slate-800">{auction.item?.name}</h1>
        <p className="mt-1 text-sm text-slate-600">
          Current high {formatCurrency(auction.currentHighestBid || auction.startPrice)}
        </p>
      </div>

      <LiveBidPanel auction={auction} />
    </div>
  );
}
