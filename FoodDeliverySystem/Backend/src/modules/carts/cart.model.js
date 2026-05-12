import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema(
  {
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    name: String,
    price: Number,
    imageUrl: String,
    quantity: { type: Number, default: 1, min: 1 },
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', default: null },
    items: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true }
);

export const CartModel = mongoose.model('Cart', CartSchema);
