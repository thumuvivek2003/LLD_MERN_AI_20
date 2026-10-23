import { TicketIdGenerator } from '../utils/TicketIdGenerator.js';

export class TicketService {
  constructor(ticketRepository) {
    this.ticketRepository = ticketRepository;
  }

  async issue({ lotId, slotId, vehicle, entryTime }) {
    return this.ticketRepository.create({
      ticketNumber: TicketIdGenerator.generate(),
      lotId,
      slotId,
      vehicle,
      entryTime,
    });
  }

  async close(ticketId, exitTime, amount) {
    return this.ticketRepository.update(ticketId, { exitTime, amount, status: 'CLOSED' });
  }

  async findByNumber(number) {
    return this.ticketRepository.findByNumber(number);
  }
}
