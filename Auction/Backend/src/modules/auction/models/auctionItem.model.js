import mongoose from 'mongoose';

const auctionItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    basePrice: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, default: '' },
  },
  { _id: false },
);

export { auctionItemSchema };
