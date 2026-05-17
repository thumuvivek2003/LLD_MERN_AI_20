import { Radio } from 'lucide-react';
import BidInputBox from './BidInputBox.jsx';
import CountdownTimer from '../../shared/components/CountdownTimer.jsx';
import { formatCurrency } from '../../shared/utils/currency.util.js';
import { AUCTION_STATUS } from '../../shared/constants/socketEvents.constant.js';
import { useAuthStore } from '../../auth/store/auth.store.js';
import { usePlaceBid } from '../hooks/usePlaceBid.js';

export default function LiveBidPanel({ auction }) {
  const user = useAuthStore((s) => s.user);
  const { placeBid, submitting } = usePlaceBid();

  const isOpen = auction?.status === AUCTION_STATUS.OPEN;
  const eligible = auction?.eligibleUserIds?.includes(user?.id);
  const insufficient = (user?.walletBalance ?? 0) < (auction?.currentHighestBid || 0);

  async function handleBid(amount) {
    try {
      await placeBid(auction.id, amount);
    } catch {
      /* toast handled */
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-600">
          <Radio size={16} className={isOpen ? 'animate-pulse' : 'opacity-40'} />
          <span className="text-xs font-semibold uppercase">
            {isOpen ? 'Live now' : auction?.status}
          </span>
        </div>
        <CountdownTimer
          endTime={auction?.endTime}
          className="font-mono text-sm text-slate-600"
        />
      </div>

      <div className="mt-4">
        <p className="text-xs text-slate-400">Current highest</p>
        <p className="text-2xl font-bold text-slate-800">
          {formatCurrency(auction?.currentHighestBid || auction?.startPrice)}
        </p>
        {auction?.highestBidderName && (
          <p className="text-xs text-slate-500">by {auction.highestBidderName}</p>
        )}
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        {!isOpen ? (
          <p className="text-sm text-slate-500">
            Bidding is closed for this auction.
          </p>
        ) : !eligible ? (
          <p className="text-sm text-amber-600">
            You are not eligible to bid on this auction.
          </p>
        ) : (
          <>
            {insufficient && (
              <p className="mb-2 text-xs text-red-600">
                Wallet balance is below the current high. Top up to bid further.
              </p>
            )}
            <BidInputBox
              auction={auction}
              onSubmit={handleBid}
              submitting={submitting}
              disabled={!isOpen}
            />
          </>
        )}
      </div>
    </div>
  );
}
