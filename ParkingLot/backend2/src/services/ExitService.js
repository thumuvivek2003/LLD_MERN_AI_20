import { TicketStatus } from '../enums/TicketStatus.js';
import { PaymentStatus } from '../enums/PaymentStatus.js';

export class ExitService {
  constructor({ ticketRepository, paymentRepository, slotService, pricingService }) {
    this.ticketRepository = ticketRepository;
    this.paymentRepository = paymentRepository;
    this.slotService = slotService;
    this.pricingService = pricingService;
  }

  async exit({ ticketNumber, paymentMethod }) {
    const ticket = await this.ticketRepository.findByNumber(ticketNumber);
    if (!ticket) throw new Error('Ticket not found');
    if (ticket.status !== TicketStatus.ACTIVE) throw new Error('Ticket not active');

    const exitTime = new Date();
    const amount = this.pricingService.calculate(ticket.entryTime, exitTime, ticket.vehicle.type);

    await this.slotService.release(ticket.slotId);
    const updatedTicket = await this.ticketRepository.update(ticket._id, {
      exitTime,
      amount,
      status: TicketStatus.CLOSED,
    });

    const payment = await this.paymentRepository.create({
      ticketId: ticket._id,
      amount,
      method: paymentMethod,
      status: PaymentStatus.PAID,
      paidAt: new Date(),
    });

    return { ticket: updatedTicket, payment };
  }
}
