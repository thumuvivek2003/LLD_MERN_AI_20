export function buildAuctionClosedEvent(auction) {
  return {
    auctionId: auction.id,
    winnerId: auction.winnerId || null,
    winnerName: auction.winnerName || null,
    finalAmount: auction.finalAmount ?? null,
  };
}

export function buildAuctionStartedEvent(auction) {
  return { auctionId: auction.id };
}
