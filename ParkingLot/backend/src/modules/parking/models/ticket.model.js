import { TicketStatus } from '../../../shared/enums/ticket-status.enum.js';

export class Ticket {
  constructor({ id, code, parkingLotId, slotId, vehicleId, entryAt, exitAt = null, amount = 0, status = TicketStatus.ACTIVE }) {
    this.id = id;
    this.code = code;
    this.parkingLotId = parkingLotId;
    this.slotId = slotId;
    this.vehicleId = vehicleId;
    this.entryAt = entryAt;
    this.exitAt = exitAt;
    this.amount = amount;
    this.status = status;
  }
}
