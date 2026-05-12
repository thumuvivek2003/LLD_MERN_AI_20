import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema(
  {
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, default: '' },
    category: { type: String, default: 'Main' },
    isVeg: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const MenuItemModel = mongoose.model('MenuItem', MenuItemSchema);
