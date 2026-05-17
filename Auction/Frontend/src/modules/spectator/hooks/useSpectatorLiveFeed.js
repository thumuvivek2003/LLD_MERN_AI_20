import { useEffect, useState } from 'react';
import { socketClient } from '../../shared/services/socketClient.js';
import { SOCKET_EVENTS } from '../../shared/constants/socketEvents.constant.js';
import { spectatorApi } from '../services/spectator.api.js';

// Read-only counterpart to useLiveAuction. Spectators get the same socket
// stream but can never bid.
export function useSpectatorLiveFeed(auctionId) {
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    if (!auctionId) return undefined;
    let mounted = true;

    spectatorApi
      .getAuctionDetails(auctionId)
      .then((data) => {
        if (!mounted) return;
        setAuction(data.auction);
        setBids(data.bids || []);
      })
      .catch(() => {});

    socketClient.joinAuctionRoom(auctionId);

    const offBid = socketClient.on(SOCKET_EVENTS.BID_NEW, (payload) => {
      if (payload.auctionId !== auctionId) return;
      setAuction((prev) =>
        prev
          ? {
              ...prev,
              currentHighestBid: payload.amount,
              highestBidderId: payload.bidderId,
              highestBidderName: payload.bidderName,
            }
          : prev
      );
      setBids((prev) => [
        {
          id: `${payload.bidderId}-${payload.timestamp}`,
          auctionId: payload.auctionId,
          bidderId: payload.bidderId,
          bidderName: payload.bidderName,
          amount: payload.amount,
          timestamp: payload.timestamp,
        },
        ...prev,
      ]);
    });

    const offClosed = socketClient.on(SOCKET_EVENTS.AUCTION_CLOSED, (payload) => {
      if (payload.auctionId !== auctionId) return;
      setAuction((prev) =>
        prev
          ? {
              ...prev,
              status: 'CLOSED',
              currentHighestBid: payload.finalAmount,
              highestBidderId: payload.winnerId,
              highestBidderName: payload.winnerName,
            }
          : prev
      );
    });

    return () => {
      mounted = false;
      offBid?.();
      offClosed?.();
      socketClient.leaveAuctionRoom(auctionId);
    };
  }, [auctionId]);

  return { auction, bids };
}
