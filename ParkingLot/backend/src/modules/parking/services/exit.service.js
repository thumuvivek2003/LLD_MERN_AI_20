import { ticketService } from './ticket.service.js';
import { slotService } from './slot.service.js';
import { paymentService } from './payment.service.js';
import { pricingService } from './pricing.service.js';
import { vehicleRepository, ticketRepository } from '../repositories/ticket.repository.js';
import { slotRepository } from '../repositories/slot.repository.js';
import { calculateFare } from '../utils/fare-calculator.js';
import { TicketMapper } from '../mappers/ticket.mapper.js';
import { TicketStatus } from '../../../shared/enums/ticket-status.enum.js';
import { AppError } from '../../../shared/exceptions/app-error.js';

const buildResponse = (ticket) => {
  const slot = slotRepository.findById(ticket.slotId);
  const vehicle = vehicleRepository.findById(ticket.vehicleId);
  const payment = paymentService.getByTicket(ticket.id);
  return TicketMapper.toResponse(ticket, { slot, vehicle, payment });
};

export class ExitService {
  search(code) {
    const ticket = ticketService.findByCode(code);
    return buildResponse(ticket);
  }

  quote(code) {
    const ticket = ticketService.findByCode(code);
    if (ticket.status === TicketStatus.CLOSED) return buildResponse(ticket);
    const vehicle = vehicleRepository.findById(ticket.vehicleId);
    const strategy = pricingService.resolveStrategy(ticket.parkingLotId);
    const amount = calculateFare(strategy, ticket, vehicle.type);
    paymentService.create(ticket.id, amount);
    ticket.amount = amount;
    return buildResponse(ticket);
  }

  pay(code) {
    const ticket = ticketService.findByCode(code);
    if (ticket.status === TicketStatus.CLOSED) throw new AppError('Ticket already closed', 409);
    let payment = paymentService.getByTicket(ticket.id);
    if (!payment) {
      const vehicle = vehicleRepository.findById(ticket.vehicleId);
      const strategy = pricingService.resolveStrategy(ticket.parkingLotId);
      const amount = calculateFare(strategy, ticket, vehicle.type);
      payment = paymentService.create(ticket.id, amount);
      ticketRepository.update(ticket.id, { amount });
    }
    paymentService.markPaid(ticket.id);
    return buildResponse(ticketService.findByCode(code));
  }

  close(code) {
    const ticket = ticketService.findByCode(code);
    if (ticket.status === TicketStatus.CLOSED) return buildResponse(ticket);
    const payment = paymentService.getByTicket(ticket.id);
    if (!payment || payment.status !== 'PAID') {
      throw new AppError('Cannot close unpaid ticket', 409);
    }
    slotService.free(ticket.slotId);
    const closed = ticketService.close(ticket.id, payment.amount);
    return buildResponse(closed);
  }
}

export const exitService = new ExitService();
