import mongoose from 'mongoose';

const parkingLotSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String },
  },
  { timestamps: true }
);

export const ParkingLotModel = mongoose.model('ParkingLot', parkingLotSchema);
