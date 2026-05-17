import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSpectatorLiveFeed } from '../hooks/useSpectatorLiveFeed.js';
import LiveWatcherPanel from '../components/LiveWatcherPanel.jsx';
import BidHistoryList from '../../member/components/BidHistoryList.jsx';
import Loader from '../../shared/components/Loader.jsx';
import { ROUTES } from '../../shared/constants/routes.constant.js';

export default function SpectatorAuctionViewPage() {
  const { id } = useParams();
  const { auction, bids } = useSpectatorLiveFeed(id);

  if (!auction) return <Loader full />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Link
          to={ROUTES.SPECTATOR_HOME}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft size={14} /> Back
        </Link>
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
            <h1 className="text-xl font-semibold text-slate-800">{auction.item?.name}</h1>
            <p className="mt-2 text-sm text-slate-600">{auction.item?.description}</p>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 mb-3">Bid history</h3>
          <BidHistoryList bids={bids} />
        </div>
      </div>
      <div className="space-y-6">
        <LiveWatcherPanel auction={auction} />
      </div>
    </div>
  );
}
