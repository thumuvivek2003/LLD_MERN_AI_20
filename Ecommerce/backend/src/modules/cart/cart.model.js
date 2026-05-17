import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const AppliedCouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    type: { type: String, required: true },
    value: { type: Number, default: 0 },
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: { type: [CartItemSchema], default: [] },
    appliedCoupon: { type: AppliedCouponSchema, default: null },
  },
  { timestamps: true }
);

export const Cart = mongoose.model('Cart', CartSchema);
