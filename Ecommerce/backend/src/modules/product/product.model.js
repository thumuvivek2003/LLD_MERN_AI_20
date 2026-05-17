import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' },
    category: { type: String, default: 'general' },
    stock: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', ProductSchema);
