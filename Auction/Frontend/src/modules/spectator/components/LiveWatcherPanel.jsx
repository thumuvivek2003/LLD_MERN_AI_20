import { Eye, Radio } from 'lucide-react';
import CountdownTimer from '../../shared/components/CountdownTimer.jsx';
import { formatCurrency } from '../../shared/utils/currency.util.js';
import StatusBadge from '../../admin/components/StatusBadge.jsx';
import { AUCTION_STATUS } from '../../shared/constants/socketEvents.constant.js';

export default function LiveWatcherPanel({ auction }) {
  const isOpen = auction?.status === AUCTION_STATUS.OPEN;
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-600">
          <Radio size={16} className={isOpen ? 'animate-pulse' : 'opacity-40'} />
          <span className="text-xs font-semibold uppercase">
            {isOpen ? 'Live' : auction?.status}
          </span>
        </div>
        <StatusBadge status={auction?.status} />
      </div>

      <div className="mt-4">
        <p className="text-xs text-slate-400">Current highest</p>
        <p className="text-3xl font-bold text-slate-800">
          {formatCurrency(auction?.currentHighestBid || auction?.startPrice)}
        </p>
        {auction?.highestBidderName && (
          <p className="text-xs text-slate-500">by {auction.highestBidderName}</p>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs text-slate-400">Time remaining</p>
        <CountdownTimer
          endTime={auction?.endTime}
          className="text-xl font-semibold text-brand-700"
        />
      </div>

      <p className="mt-5 inline-flex items-center gap-1 text-xs text-slate-500">
        <Eye size={12} /> You are watching as a spectator. Bidding is disabled.
      </p>
    </div>
  );
}
