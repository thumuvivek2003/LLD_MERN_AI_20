import mongoose from 'mongoose';
import { RIDE_STATUS, PAYMENT_STATUS } from '../../config/constants.js';

const locationSchema = new mongoose.Schema(
  {
    address: String,
    lat: Number,
    lng: Number,
  },
  { _id: false },
);

const rideSchema = new mongoose.Schema(
  {
    rider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', default: null },

    pickup: { type: locationSchema, required: true },
    drop: { type: locationSchema, required: true },
    distanceKm: { type: Number, default: 0 },
    fare: { type: Number, default: 0 },

    status: { type: String, enum: Object.values(RIDE_STATUS), default: RIDE_STATUS.REQUESTED, index: true },
    otp: { type: String, default: null },
    paymentStatus: { type: String, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.PENDING },

    requestedAt: { type: Date, default: Date.now },
    assignedAt: Date,
    arrivedAt: Date,
    startedAt: Date,
    completedAt: Date,
    cancelledAt: Date,
    cancelledBy: { type: String, default: null },
  },
  { timestamps: true },
);

export const Ride = mongoose.model('Ride', rideSchema);
