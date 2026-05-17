import { useEffect } from 'react';
import { socketClient } from '../../shared/services/socketClient.js';
import { SOCKET_EVENTS } from '../../shared/constants/socketEvents.constant.js';
import { useMemberAuctionStore } from '../store/auction.store.js';
import { memberAuctionApi } from '../services/auction.api.js';
import { showInfoToast } from '../../shared/utils/toast.util.js';

// Loads an auction by id, subscribes to live bid + close events, and
// keeps the member store in sync. Returns the slice for convenience.
export function useLiveAuction(auctionId) {
  const { currentAuction, bids, setCurrent, applyNewBid, markClosed } =
    useMemberAuctionStore();

  useEffect(() => {
    if (!auctionId) return undefined;
    let mounted = true;

    async function fetchInitial() {
      const data = await memberAuctionApi.getAuctionDetails(auctionId);
      if (mounted) setCurrent(data.auction, data.bids || []);
    }
    fetchInitial().catch(() => {});

    socketClient.joinAuctionRoom(auctionId);

    const offBid = socketClient.on(SOCKET_EVENTS.BID_NEW, (payload) => {
      if (payload.auctionId === auctionId) applyNewBid(payload);
    });
    const offClosed = socketClient.on(SOCKET_EVENTS.AUCTION_CLOSED, (payload) => {
      if (payload.auctionId === auctionId) {
        markClosed(payload);
        showInfoToast(`Auction closed. Winner: ${payload.winnerName || 'N/A'}`);
      }
    });

    return () => {
      mounted = false;
      offBid?.();
      offClosed?.();
      socketClient.leaveAuctionRoom(auctionId);
    };
  }, [auctionId, setCurrent, applyNewBid, markClosed]);

  return { auction: currentAuction, bids };
}
