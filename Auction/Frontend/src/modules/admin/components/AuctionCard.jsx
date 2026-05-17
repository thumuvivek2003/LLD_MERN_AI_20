import { Link } from 'react-router-dom';
import { formatCurrency } from '../../shared/utils/currency.util.js';
import { formatDate } from '../../shared/utils/timer.util.js';
import StatusBadge from './StatusBadge.jsx';
import { ROUTES } from '../../shared/constants/routes.constant.js';

export default function AuctionCard({ auction }) {
  return (
    <Link
      to={ROUTES.ADMIN_AUCTION_DETAILS(auction.id)}
      className="card p-4 flex gap-4 hover:shadow-md transition-shadow"
    >
      <div className="h-20 w-20 rounded-lg bg-slate-100 overflow-hidden shrink-0">
        {auction.item?.imageUrl ? (
          <img
            src={auction.item.imageUrl}
            alt={auction.item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-xs text-slate-400">
            No image
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-slate-800 truncate">{auction.item?.name}</h4>
          <StatusBadge status={auction.status} />
        </div>
        <p className="mt-1 text-xs text-slate-500 line-clamp-2">
          {auction.item?.description}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-slate-400">Current</p>
            <p className="font-semibold text-slate-800">
              {formatCurrency(auction.currentHighestBid || auction.startPrice)}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Ends</p>
            <p className="font-medium text-slate-700">{formatDate(auction.endTime)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
