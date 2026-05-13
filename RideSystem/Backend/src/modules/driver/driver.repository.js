import { BaseRepository } from '../../core/base/base.repository.js';
import { Driver } from './driver.model.js';
import { DRIVER_STATUS } from '../../config/constants.js';

class DriverRepository extends BaseRepository {
  constructor() {
    super(Driver);
  }

  findByUser(userId) {
    return this.model.findOne({ user: userId }).populate('user').populate('activeVehicle');
  }

  findOnline() {
    return this.model.find({ status: DRIVER_STATUS.ONLINE }).populate('user').populate('activeVehicle');
  }

  updateByUser(userId, update) {
    return this.model.findOneAndUpdate({ user: userId }, update, { new: true, upsert: true });
  }
}

export const driverRepository = new DriverRepository();
