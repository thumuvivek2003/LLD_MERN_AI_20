import { db } from '../../../config/db.config.js';
import { BaseRepository } from '../../../shared/database/base.repository.js';
import { SlotStatus } from '../../../shared/enums/slot-status.enum.js';

class SlotRepository extends BaseRepository {
  constructor() { super(db.slots); }
  findByLot(parkingLotId) { return this.find((s) => s.parkingLotId === parkingLotId); }
  findByFloor(floorId) { return this.find((s) => s.floorId === floorId); }
  findAvailable(parkingLotId, vehicleType) {
    return this.find(
      (s) => s.parkingLotId === parkingLotId
        && s.status === SlotStatus.AVAILABLE
        && s.vehicleType === vehicleType,
    );
  }
}

export const slotRepository = new SlotRepository();
