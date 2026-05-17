import { create } from 'zustand';

export const useMemberAuctionStore = create((set) => ({
  liveAuctions: [],
  currentAuction: null,
  bids: [],

  setLiveAuctions: (liveAuctions) => set({ liveAuctions }),
  setCurrent: (auction, bids = []) => set({ currentAuction: auction, bids }),

  // Called when `bid:new` socket event arrives — bumps the highest bid and
  // prepends a row to the local history without a round-trip.
  applyNewBid: (bid) =>
    set((state) => {
      if (!state.currentAuction || state.currentAuction.id !== bid.auctionId) {
        return state;
      }
      return {
        currentAuction: {
          ...state.currentAuction,
          currentHighestBid: bid.amount,
          highestBidderId: bid.bidderId,
          highestBidderName: bid.bidderName,
        },
        bids: [
          {
            id: `${bid.bidderId}-${bid.timestamp}`,
            auctionId: bid.auctionId,
            bidderId: bid.bidderId,
            bidderName: bid.bidderName,
            amount: bid.amount,
            timestamp: bid.timestamp,
          },
          ...state.bids,
        ],
      };
    }),

  markClosed: (payload) =>
    set((state) => {
      if (!state.currentAuction || state.currentAuction.id !== payload.auctionId) {
        return state;
      }
      return {
        currentAuction: {
          ...state.currentAuction,
          status: 'CLOSED',
          highestBidderId: payload.winnerId,
          highestBidderName: payload.winnerName,
          currentHighestBid: payload.finalAmount,
        },
      };
    }),
}));
