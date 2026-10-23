import { TicketStatus } from '../enums/TicketStatus.js';

export class Ticket {
  constructor({ id, ticketNumber, vehicle, slotId, lotId, entryTime, exitTime = null, amount = 0, status = TicketStatus.ACTIVE }) {
    this.id = id;
    this.ticketNumber = ticketNumber;
    this.vehicle = vehicle;
    this.slotId = slotId;
    this.lotId = lotId;
    this.entryTime = entryTime;
    this.exitTime = exitTime;
    this.amount = amount;
    this.status = status;
  }

  close(exitTime, amount) {
    this.exitTime = exitTime;
    this.amount = amount;
    this.status = TicketStatus.CLOSED;
  }
}
