import { BaseRepository } from '../../core/base/base.repository.js';
import { Vehicle } from './vehicle.model.js';

class VehicleRepository extends BaseRepository {
  constructor() {
    super(Vehicle);
  }

  findByOwner(ownerId) {
    return this.model.find({ owner: ownerId });
  }
}

export const vehicleRepository = new VehicleRepository();
