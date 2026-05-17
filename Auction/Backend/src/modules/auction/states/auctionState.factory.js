import { AUCTION_STATUS } from '../../../shared/constants/auctionStatus.constant.js';
import { ScheduledAuctionState } from './scheduledAuction.state.js';
import { OpenAuctionState } from './openAuction.state.js';
import { ClosedAuctionState } from './closedAuction.state.js';
import { CancelledAuctionState } from './cancelledAuction.state.js';

const SINGLETONS = {
  [AUCTION_STATUS.SCHEDULED]: new ScheduledAuctionState(),
  [AUCTION_STATUS.OPEN]: new OpenAuctionState(),
  [AUCTION_STATUS.CLOSED]: new ClosedAuctionState(),
  [AUCTION_STATUS.CANCELLED]: new CancelledAuctionState(),
};

export function createAuctionState(status) {
  const state = SINGLETONS[status];
  if (!state) throw new Error(`No state handler for status ${status}`);
  return state;
}
