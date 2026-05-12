import mongoose from 'mongoose';
import { DELIVERY_STATUS } from '../../core/constants/delivery.constants.js';

const DeliveryPartnerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: String,
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    status: { type: String, enum: Object.values(DELIVERY_STATUS), default: DELIVERY_STATUS.AVAILABLE },
    location: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    earnings: { type: Number, default: 0 },
    completedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const DeliveryPartnerModel = mongoose.model('DeliveryPartner', DeliveryPartnerSchema);
