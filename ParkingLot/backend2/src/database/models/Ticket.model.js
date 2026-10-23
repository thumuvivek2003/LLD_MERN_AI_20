import mongoose from 'mongoose';
import { TicketStatus } from '../../enums/TicketStatus.js';
import { VehicleType } from '../../enums/VehicleType.js';

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: { type: String, required: true, unique: true, index: true },
    lotId: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingLot', required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSlot', required: true },
    vehicle: {
      licensePlate: { type: String, required: true },
      type: { type: String, enum: Object.values(VehicleType), required: true },
    },
    entryTime: { type: Date, required: true },
    exitTime: { type: Date, default: null },
    amount: { type: Number, default: 0 },
    status: { type: String, enum: Object.values(TicketStatus), default: TicketStatus.ACTIVE, index: true },
  },
  { timestamps: true }
);

export const TicketModel = mongoose.model('Ticket', ticketSchema);
