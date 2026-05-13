import { BaseService } from '../../core/base/base.service.js';
import { vehicleRepository } from './vehicle.repository.js';
import { VehicleFactory } from './vehicle.factory.js';
import { driverService } from '../driver/driver.service.js';

class VehicleService extends BaseService {
  constructor() {
    super(vehicleRepository);
  }

  async create(ownerId, payload) {
    const data = VehicleFactory.create({ ...payload, owner: ownerId });
    const vehicle = await this.repository.create(data);
    await driverService.setActiveVehicle(ownerId, vehicle._id);
    return vehicle;
  }

  listMine(ownerId) {
    return this.repository.findByOwner(ownerId);
  }
}

export const vehicleService = new VehicleService();
