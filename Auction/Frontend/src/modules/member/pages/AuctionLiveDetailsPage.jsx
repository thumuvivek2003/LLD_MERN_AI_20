import { useParams, Link } from 'react-router-dom';
import { Gavel } from 'lucide-react';
import { useLiveAuction } from '../hooks/useLiveAuction.js';
import Loader from '../../shared/components/Loader.jsx';
import LiveBidPanel from '../components/LiveBidPanel.jsx';
import BidHistoryList from '../components/BidHistoryList.jsx';
import { formatCurrency } from '../../shared/utils/currency.util.js';
import StatusBadge from '../../admin/components/StatusBadge.jsx';
import { ROUTES } from '../../shared/constants/routes.constant.js';

export default function AuctionLiveDetailsPage() {
  const { id } = useParams();
  const { auction, bids } = useLiveAuction(id);

  if (!auction) return <Loader full />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="card overflow-hidden">
          <div className="h-64 bg-slate-100">
            {auction.item?.imageUrl ? (
              <img
                src={auction.item.imageUrl}
                alt={auction.item.name}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-slate-800">{auction.item?.name}</h1>
              <StatusBadge status={auction.status} />
            </div>
            <p className="mt-2 text-sm text-slate-600">{auction.item?.description}</p>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-400">Start price</p>
                <p className="font-medium">{formatCurrency(auction.startPrice)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Increment</p>
                <p className="font-medium">
                  {auction.increment?.type} · {auction.increment?.value}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Eligible bidders</p>
                <p className="font-medium">{auction.eligibleUserIds?.length || 0}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Total bids</p>
                <p className="font-medium">{bids.length}</p>
              </div>
            </div>
            <Link
              to={ROUTES.MEMBER_PLACE_BID(auction.id)}
              className="btn-secondary mt-5 inline-flex"
            >
              <Gavel size={14} /> Open bid form
            </Link>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 mb-3">Bid history</h3>
          <BidHistoryList bids={bids} />
        </div>
      </div>

      <div className="space-y-6">
        <LiveBidPanel auction={auction} />
      </div>
    </div>
  );
}
