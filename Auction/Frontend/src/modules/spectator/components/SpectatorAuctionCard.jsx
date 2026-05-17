import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { formatCurrency } from '../../shared/utils/currency.util.js';
import CountdownTimer from '../../shared/components/CountdownTimer.jsx';
import { ROUTES } from '../../shared/constants/routes.constant.js';

export default function SpectatorAuctionCard({ auction }) {
  return (
    <Link to={ROUTES.SPECTATOR_AUCTION(auction.id)} className="card overflow-hidden block">
      <div className="h-40 bg-slate-100">
        {auction.item?.imageUrl ? (
          <img
            src={auction.item.imageUrl}
            alt={auction.item.name}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-slate-800">{auction.item?.name}</h4>
          <span className="badge bg-emerald-100 text-emerald-700">LIVE</span>
        </div>
        <p className="mt-1 text-xs text-slate-500 line-clamp-2">
          {auction.item?.description}
        </p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase text-slate-400">Current bid</p>
            <p className="text-lg font-semibold text-slate-800">
              {formatCurrency(auction.currentHighestBid || auction.startPrice)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase text-slate-400">Time left</p>
            <CountdownTimer
              endTime={auction.endTime}
              className="text-sm font-medium text-brand-700"
            />
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-1 text-xs text-brand-600">
          <Eye size={12} /> Watch live
        </div>
      </div>
    </Link>
  );
}
