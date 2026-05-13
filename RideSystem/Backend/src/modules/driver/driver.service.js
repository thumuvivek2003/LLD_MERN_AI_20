import { BaseService } from '../../core/base/base.service.js';
import { driverRepository } from './driver.repository.js';
import { AppError } from '../../core/exceptions/app.error.js';
import { DRIVER_STATUS } from '../../config/constants.js';

class DriverService extends BaseService {
  constructor() {
    super(driverRepository);
  }

  async ensureDriverProfile(userId) {
    const existing = await this.repository.findByUser(userId);
    if (existing) return existing;
    return this.repository.create({ user: userId });
  }

  async getByUser(userId) {
    const d = await this.repository.findByUser(userId);
    if (!d) throw new AppError('Driver profile not found', 404);
    return d;
  }

  setStatus(userId, status) {
    return this.repository.updateByUser(userId, { status });
  }

  setBusy(userId, isBusy) {
    return this.repository.updateByUser(userId, {
      status: isBusy ? DRIVER_STATUS.BUSY : DRIVER_STATUS.ONLINE,
    });
  }

  updateLocation(userId, { lat, lng }) {
    return this.repository.updateByUser(userId, { currentLocation: { lat, lng } });
  }

  setActiveVehicle(userId, vehicleId) {
    return this.repository.updateByUser(userId, { activeVehicle: vehicleId });
  }

  incrementEarnings(userId, amount) {
    return this.repository.model.findOneAndUpdate(
      { user: userId },
      { $inc: { totalEarnings: amount, totalTrips: 1 } },
      { new: true },
    );
  }

  listOnline() {
    return this.repository.findOnline();
  }
}

export const driverService = new DriverService();
