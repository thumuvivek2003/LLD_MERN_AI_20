import { db } from '../../../config/db.config.js';
import { BaseRepository } from '../../../shared/database/base.repository.js';

class TicketRepository extends BaseRepository {
  constructor() { super(db.tickets); }
  findByCode(code) { return this.findOne((t) => t.code === code); }
}

class VehicleRepository extends BaseRepository {
  constructor() { super(db.vehicles); }
  findByPlate(plate) { return this.findOne((v) => v.plate === plate); }
}

export const ticketRepository = new TicketRepository();
export const vehicleRepository = new VehicleRepository();
