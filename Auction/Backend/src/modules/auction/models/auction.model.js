import mongoose from 'mongoose';
import { auctionItemSchema } from './auctionItem.model.js';
import { AUCTION_STATUS, INCREMENT_TYPE } from '../../../shared/constants/auctionStatus.constant.js';

const incrementSchema = new mongoose.Schema(
  {
    type: { type: String, enum: Object.values(INCREMENT_TYPE), required: true },
    value: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const auctionSchema = new mongoose.Schema(
  {
    item: { type: auctionItemSchema, required: true },
    startPrice: { type: Number, required: true, min: 0 },
    currentHighestBid: { type: Number, default: 0 },
    highestBidderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    highestBidderName: { type: String, default: null },
    status: {
      type: String,
      enum: Object.values(AUCTION_STATUS),
      default: AUCTION_STATUS.SCHEDULED,
      index: true,
    },
    startTime: { type: Date, required: true, index: true },
    endTime: { type: Date, required: true, index: true },
    increment: { type: incrementSchema, required: true },
    eligibleUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // optimistic lock counter — incremented on every successful bid/state change
    version: { type: Number, default: 0 },
    winnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    winnerName: { type: String, default: null },
    finalAmount: { type: Number, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        if (ret.eligibleUserIds) ret.eligibleUserIds = ret.eligibleUserIds.map((x) => x.toString());
        if (ret.highestBidderId) ret.highestBidderId = ret.highestBidderId.toString();
        if (ret.createdBy) ret.createdBy = ret.createdBy.toString();
        if (ret.winnerId) ret.winnerId = ret.winnerId.toString();
        return ret;
      },
    },
  },
);

export const AuctionModel = mongoose.models.Auction || mongoose.model('Auction', auctionSchema);
