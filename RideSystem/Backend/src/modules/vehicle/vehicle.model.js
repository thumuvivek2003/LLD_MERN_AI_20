import mongoose from 'mongoose';
import { VEHICLE_TYPE } from '../../config/constants.js';

const vehicleSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: Object.values(VEHICLE_TYPE), required: true },
    model: { type: String, required: true },
    numberPlate: { type: String, required: true, unique: true },
    color: { type: String, default: '' },
  },
  { timestamps: true },
);

export const Vehicle = mongoose.model('Vehicle', vehicleSchema);
