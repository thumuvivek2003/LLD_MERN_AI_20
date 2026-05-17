import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, Ban } from 'lucide-react';
import { adminAuctionApi } from '../services/adminAuction.api.js';
import Loader from '../../shared/components/Loader.jsx';
import Button from '../../shared/components/Button.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { formatCurrency } from '../../shared/utils/currency.util.js';
import { formatDate } from '../../shared/utils/timer.util.js';
import { AUCTION_STATUS } from '../../shared/constants/socketEvents.constant.js';
import { ROUTES } from '../../shared/constants/routes.constant.js';
import { showSuccessToast } from '../../shared/utils/toast.util.js';

export default function AuctionDetailsPage() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await adminAuctionApi.getAuctionById(id);
      setAuction(data.auction);
      setBids(data.bids || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleClose() {
    setClosing(true);
    try {
      const data = await adminAuctionApi.closeAuction(id);
      setAuction(data.auction);
      showSuccessToast('Auction closed');
    } finally {
      setClosing(false);
    }
  }

  if (loading) return <Loader full />;
  if (!auction) return <p className="text-sm text-slate-500">Auction not found.</p>;

  const canClose = auction.status === AUCTION_STATUS.OPEN;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500">Auction details</p>
          <h1 className="text-xl font-semibold text-slate-800">{auction.item?.name}</h1>
          <div className="mt-1 flex items-center gap-2">
            <StatusBadge status={auction.status} />
            <span className="text-xs text-slate-500">
              {formatDate(auction.startTime)} → {formatDate(auction.endTime)}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={ROUTES.ADMIN_ASSIGN(auction.id)} className="btn-secondary">
            <Users size={14} /> Assign bidders
          </Link>
          <Button variant="danger" disabled={!canClose} loading={closing} onClick={handleClose}>
            <Ban size={14} /> Close auction
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold text-slate-800 mb-3">Item</h3>
          <div className="flex gap-4">
            <div className="h-28 w-28 rounded-lg bg-slate-100 overflow-hidden shrink-0">
              {auction.item?.imageUrl ? (
                <img src={auction.item.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-600">{auction.item?.description}</p>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400">Base</p>
                  <p className="font-medium">{formatCurrency(auction.item?.basePrice)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Start</p>
                  <p className="font-medium">{formatCurrency(auction.startPrice)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Current high</p>
                  <p className="font-semibold text-brand-700">
                    {formatCurrency(auction.currentHighestBid || auction.startPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Increment</p>
                  <p className="font-medium">
                    {auction.increment?.type} · {auction.increment?.value}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 mb-2">Winner</h3>
          {auction.highestBidderName ? (
            <div>
              <p className="text-sm text-slate-700">{auction.highestBidderName}</p>
              <p className="text-xl font-semibold text-emerald-600 mt-1">
                {formatCurrency(auction.currentHighestBid)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-400">No bids yet.</p>
          )}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold text-slate-800 mb-3">Bid history ({bids.length})</h3>
        {bids.length === 0 ? (
          <p className="text-sm text-slate-400">No bids yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {bids.map((b) => (
              <li key={b.id} className="py-2 flex items-center justify-between text-sm">
                <span className="text-slate-700">{b.bidderName}</span>
                <span className="font-semibold">{formatCurrency(b.amount)}</span>
                <span className="text-xs text-slate-400">{formatDate(b.timestamp)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
