import mongoose from 'mongoose';

const RestaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    rating: { type: Number, default: 4.0, min: 0, max: 5 },
    imageUrl: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    managedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

RestaurantSchema.index({ latitude: 1, longitude: 1 });

export const RestaurantModel = mongoose.model('Restaurant', RestaurantSchema);
