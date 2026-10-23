import { Ticket } from '../models/ticket.model.js';
import { ticketRepository } from '../repositories/ticket.repository.js';
import { NotFoundError } from '../../../shared/exceptions/not-found-error.js';
import { TicketStatus } from '../../../shared/enums/ticket-status.enum.js';
import { generateTicketCode } from '../utils/ticket-generator.js';

export class TicketService {
  open({ parkingLotId, slotId, vehicleId }) {
    return ticketRepository.create(new Ticket({
      code: generateTicketCode(),
      parkingLotId,
      slotId,
      vehicleId,
      entryAt: new Date().toISOString(),
    }));
  }

  findByCode(code) {
    const ticket = ticketRepository.findByCode(code);
    if (!ticket) throw new NotFoundError('Ticket not found');
    return ticket;
  }

  close(ticketId, amount) {
    return ticketRepository.update(ticketId, {
      status: TicketStatus.CLOSED,
      exitAt: new Date().toISOString(),
      amount,
    });
  }
}

export const ticketService = new TicketService();
