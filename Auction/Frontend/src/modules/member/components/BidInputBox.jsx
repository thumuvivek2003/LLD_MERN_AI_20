import { useEffect, useState } from 'react';
import Button from '../../shared/components/Button.jsx';
import { formatCurrency } from '../../shared/utils/currency.util.js';
import { INCREMENT_TYPE } from '../../shared/constants/socketEvents.constant.js';

function suggestedNextBid(auction) {
  if (!auction) return 0;
  const base = auction.currentHighestBid || auction.startPrice;
  const inc = auction.increment;
  if (!inc) return base + 100;
  if (inc.type === INCREMENT_TYPE.PERCENTAGE) {
    return Math.ceil(base * (1 + inc.value / 100));
  }
  return base + inc.value;
}

export default function BidInputBox({ auction, onSubmit, submitting, disabled }) {
  const [amount, setAmount] = useState(() => suggestedNextBid(auction));

  useEffect(() => {
    setAmount(suggestedNextBid(auction));
  }, [auction?.currentHighestBid, auction?.startPrice, auction?.increment?.type, auction?.increment?.value]); // eslint-disable-line

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(Number(amount));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="label">Your bid</label>
        <input
          type="number"
          required
          min={(auction?.currentHighestBid || auction?.startPrice || 0) + 1}
          className="input text-lg font-semibold"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <p className="mt-1 text-xs text-slate-500">
          Suggested next: {formatCurrency(suggestedNextBid(auction))}
        </p>
      </div>
      <Button type="submit" loading={submitting} disabled={disabled} className="w-full">
        Place bid
      </Button>
    </form>
  );
}
