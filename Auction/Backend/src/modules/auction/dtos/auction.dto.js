import { z } from 'zod';
import { INCREMENT_TYPE, AUCTION_STATUS } from '../../../shared/constants/auctionStatus.constant.js';

export const createAuctionSchema = z
  .object({
    item: z.object({
      name: z.string().min(1),
      description: z.string().optional().default(''),
      basePrice: z.number().nonnegative(),
      imageUrl: z.string().optional().default(''),
    }),
    startPrice: z.number().nonnegative(),
    startTime: z.string().or(z.date()),
    endTime: z.string().or(z.date()),
    increment: z.object({
      type: z.enum([INCREMENT_TYPE.FIXED, INCREMENT_TYPE.PERCENTAGE]),
      value: z.number().positive(),
    }),
    eligibleUserIds: z.array(z.string()).default([]),
  })
  .refine((d) => new Date(d.endTime) > new Date(d.startTime), {
    message: 'endTime must be after startTime',
    path: ['endTime'],
  });

export const assignBiddersSchema = z.object({
  userIds: z.array(z.string()).min(1),
});

export const listAuctionsSchema = z.object({
  status: z
    .enum([
      AUCTION_STATUS.SCHEDULED,
      AUCTION_STATUS.OPEN,
      AUCTION_STATUS.CLOSED,
      AUCTION_STATUS.CANCELLED,
    ])
    .optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export function toAuctionDTO(doc) {
  if (!doc) return null;
  const o = doc.toJSON ? doc.toJSON() : doc;
  return {
    id: o.id,
    item: o.item,
    startPrice: o.startPrice,
    currentHighestBid: o.currentHighestBid,
    highestBidderId: o.highestBidderId,
    highestBidderName: o.highestBidderName,
    status: o.status,
    startTime: o.startTime,
    endTime: o.endTime,
    increment: o.increment,
    eligibleUserIds: o.eligibleUserIds || [],
    createdBy: o.createdBy,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    version: o.version,
    winnerId: o.winnerId || null,
    winnerName: o.winnerName || null,
    finalAmount: o.finalAmount ?? null,
  };
}
