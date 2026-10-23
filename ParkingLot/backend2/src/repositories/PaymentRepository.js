import { PaymentModel } from '../database/models/Payment.model.js';

export class PaymentRepository {
  async create(data) {
    const payment = await PaymentModel.create(data);
    return payment.toObject();
  }

  async findByTicket(ticketId) {
    return PaymentModel.findOne({ ticketId }).lean();
  }

  async update(id, patch) {
    return PaymentModel.findByIdAndUpdate(id, patch, { new: true }).lean();
  }
}
