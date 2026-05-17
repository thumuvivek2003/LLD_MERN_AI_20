import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema(
  {
    auctionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction', required: true, index: true },
    bidderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    bidderName: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    timestamp: { type: Date, default: () => new Date(), index: true },
  },
  {
    toJSON: {
      versionKey: false,
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        ret.auctionId = ret.auctionId.toString();
        ret.bidderId = ret.bidderId.toString();
        return ret;
      },
    },
  },
);

export const BidModel = mongoose.models.Bid || mongoose.model('Bid', bidSchema);
