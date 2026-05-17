import { z } from 'zod';

export const placeBidSchema = z.object({
  amount: z.number().positive(),
});

export function toBidDTO(doc) {
  const o = doc.toJSON ? doc.toJSON() : doc;
  return {
    id: o.id,
    auctionId: o.auctionId,
    bidderId: o.bidderId,
    bidderName: o.bidderName,
    amount: o.amount,
    timestamp: o.timestamp,
  };
}
