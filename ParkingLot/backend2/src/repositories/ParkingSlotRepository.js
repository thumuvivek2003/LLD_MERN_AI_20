import { ParkingSlotModel } from '../database/models/ParkingSlot.model.js';
import { SlotStatus } from '../enums/SlotStatus.js';

export class ParkingSlotRepository {
  async create(data) {
    const slot = await ParkingSlotModel.create(data);
    return slot.toObject();
  }

  async findById(id) {
    return ParkingSlotModel.findById(id).lean();
  }

  async findFirstAvailable(lotId, vehicleType) {
    return ParkingSlotModel.findOne({ lotId, vehicleType, status: SlotStatus.AVAILABLE }).lean();
  }

  async findNearestAvailable(lotId, vehicleType) {
    return ParkingSlotModel.findOne({ lotId, vehicleType, status: SlotStatus.AVAILABLE })
      .sort({ floorNumber: 1, slotNumber: 1 })
      .lean();
  }

  async findAllAvailable(lotId, vehicleType) {
    return ParkingSlotModel.find({ lotId, vehicleType, status: SlotStatus.AVAILABLE }).lean();
  }

  async updateStatus(id, status) {
    return ParkingSlotModel.findByIdAndUpdate(id, { status }, { new: true }).lean();
  }

  async findByLot(lotId) {
    return ParkingSlotModel.find({ lotId }).lean();
  }
}
