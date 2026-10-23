import { db } from '../../../config/db.config.js';
import { BaseRepository } from '../../../shared/database/base.repository.js';

class ParkingLotRepository extends BaseRepository {
  constructor() { super(db.parkingLots); }
}

class FloorRepository extends BaseRepository {
  constructor() { super(db.floors); }
  findByLot(parkingLotId) { return this.find((f) => f.parkingLotId === parkingLotId); }
}

export const parkingLotRepository = new ParkingLotRepository();
export const floorRepository = new FloorRepository();
