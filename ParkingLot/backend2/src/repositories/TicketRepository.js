import { TicketModel } from '../database/models/Ticket.model.js';

export class TicketRepository {
  async create(data) {
    const ticket = await TicketModel.create(data);
    return ticket.toObject();
  }

  async findById(id) {
    return TicketModel.findById(id).lean();
  }

  async findByNumber(ticketNumber) {
    return TicketModel.findOne({ ticketNumber }).lean();
  }

  async update(id, patch) {
    return TicketModel.findByIdAndUpdate(id, patch, { new: true }).lean();
  }
}
