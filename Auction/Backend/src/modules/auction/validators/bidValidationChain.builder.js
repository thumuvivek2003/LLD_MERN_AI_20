import { AuctionOpenValidator } from './bidValidators/auctionOpen.validator.js';
import { BidTimeValidator } from './bidValidators/bidTime.validator.js';
import { EligibleBidderValidator } from './bidValidators/eligibleBidder.validator.js';
import { MinimumBidValidator } from './bidValidators/minimumBid.validator.js';
import { IncrementStrategyValidator } from './bidValidators/incrementStrategy.validator.js';
import { WalletBalanceValidator } from './bidValidators/walletBalance.validator.js';

// Order is contract-defined; keep it stable.
export function buildValidationChain() {
  const open = new AuctionOpenValidator();
  const time = new BidTimeValidator();
  const eligible = new EligibleBidderValidator();
  const min = new MinimumBidValidator();
  const incr = new IncrementStrategyValidator();
  const wallet = new WalletBalanceValidator();

  open.setNext(time);
  time.setNext(eligible);
  eligible.setNext(min);
  min.setNext(incr);
  incr.setNext(wallet);

  return open;
}
