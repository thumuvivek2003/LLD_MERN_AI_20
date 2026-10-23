import { Payment } from '../models/payment.model.js';
import { paymentRepository } from '../repositories/payment.repository.js';
import { PaymentStatus } from '../../../shared/enums/payment-status.enum.js';
import { AppError } from '../../../shared/exceptions/app-error.js';

export class PaymentService {
  create(ticketId, amount) {
    const existing = paymentRepository.findByTicket(ticketId);
    if (existing) return existing;
    return paymentRepository.create(new Payment({ ticketId, amount }));
  }

  markPaid(ticketId) {
    const payment = paymentRepository.findByTicket(ticketId);
    if (!payment) throw new AppError('Payment record not found', 404);
    if (payment.status === PaymentStatus.PAID) return payment;
    return paymentRepository.update(payment.id, {
      status: PaymentStatus.PAID,
      paidAt: new Date().toISOString(),
    });
  }

  getByTicket(ticketId) {
    return paymentRepository.findByTicket(ticketId);
  }
}

export const paymentService = new PaymentService();
