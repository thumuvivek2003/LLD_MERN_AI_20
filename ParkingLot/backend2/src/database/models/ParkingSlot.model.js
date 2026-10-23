import mongoose from 'mongoose';
import { SlotStatus } from '../../enums/SlotStatus.js';
import { VehicleType } from '../../enums/VehicleType.js';

const parkingSlotSchema = new mongoose.Schema(
  {
    lotId: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingLot', required: true, index: true },
    floorNumber: { type: Number, required: true },
    slotNumber: { type: Number, required: true },
    vehicleType: { type: String, enum: Object.values(VehicleType), required: true },
    status: { type: String, enum: Object.values(SlotStatus), default: SlotStatus.AVAILABLE, index: true },
  },
  { timestamps: true }
);

parkingSlotSchema.index({ lotId: 1, floorNumber: 1, slotNumber: 1 }, { unique: true });

export const ParkingSlotModel = mongoose.model('ParkingSlot', parkingSlotSchema);
