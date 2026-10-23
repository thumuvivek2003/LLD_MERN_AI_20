import { ParkingLotModel } from '../database/models/ParkingLot.model.js';

export class ParkingLotRepository {
  async create(data) {
    const lot = await ParkingLotModel.create(data);
    return lot.toObject();
  }

  async findById(id) {
    return ParkingLotModel.findById(id).lean();
  }

  async findAll() {
    return ParkingLotModel.find().lean();
  }
}
