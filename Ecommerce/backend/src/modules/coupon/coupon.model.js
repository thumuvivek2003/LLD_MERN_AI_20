import mongoose from 'mongoose';
import { COUPON_TYPE } from '../../common/constants/couponType.constants.js';

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: Object.values(COUPON_TYPE), required: true },
    value: { type: Number, default: 0 },
    minCartValue: { type: Number, default: 0 },
    description: { type: String, default: '' },
    active: { type: Boolean, default: true },
    assignedUserIds: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model('Coupon', CouponSchema);
