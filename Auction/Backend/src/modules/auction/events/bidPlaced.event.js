export function buildBidPlacedEvent({ auction, bid }) {
  return {
    auctionId: auction.id,
    amount: bid.amount,
    bidderId: bid.bidderId,
    bidderName: bid.bidderName,
    timestamp: bid.timestamp,
  };
}
