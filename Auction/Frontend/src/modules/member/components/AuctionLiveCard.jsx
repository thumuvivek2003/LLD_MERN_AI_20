import { Link } from 'react-router-dom';
import { formatCurrency } from '../../shared/utils/currency.util.js';
import CountdownTimer from '../../shared/components/CountdownTimer.jsx';
import { ROUTES } from '../../shared/constants/routes.constant.js';

export default function AuctionLiveCard({ auction }) {
  return (
    <div className="card overflow-hidden flex flex-col">
      <div className="h-40 bg-slate-100">
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
      <div className="p-4 flex-1 flex flex-col">
        <h4 className="font-semibold text-slate-800">{auction.item?.name}</h4>
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
            <p className="text-[11px] uppercase text-slate-400">Ends in</p>
            <CountdownTimer
              endTime={auction.endTime}
              className="text-sm font-medium text-brand-700"
            />
          </div>
        </div>
        <Link
          to={ROUTES.MEMBER_AUCTION_DETAILS(auction.id)}
          className="btn-primary mt-4 w-full justify-center"
        >
          Join auction
        </Link>
      </div>
    </div>
  );
}
