import mongoose from 'mongoose';
import { DRIVER_STATUS } from '../../config/constants.js';

const driverSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    license: { type: String, default: '' },
    status: { type: String, enum: Object.values(DRIVER_STATUS), default: DRIVER_STATUS.OFFLINE },
    currentLocation: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    rating: { type: Number, default: 5 },
    totalTrips: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    activeVehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', default: null },
  },
  { timestamps: true },
);

export const Driver = mongoose.model('Driver', driverSchema);
