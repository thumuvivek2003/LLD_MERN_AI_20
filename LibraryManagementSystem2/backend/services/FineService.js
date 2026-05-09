import { FineRepository } from '../repositories/FineRepository.js';
import { BorrowRepository } from '../repositories/BorrowRepository.js';
import { DefaultFineStrategy } from '../strategy-pattern/DefaultFineStrategy.js';
import { PremiumUserFineStrategy } from '../strategy-pattern/PremiumUserFineStrategy.js';
import { calcOverdueDays } from '../utils/dateUtils.js';

const fineRepository = new FineRepository();
const borrowRepository = new BorrowRepository();

export class FineService {
  async calculateFine(requestId, isPremiumUser = false) {
    const request = await borrowRepository.findById(requestId);
    if (!request) throw new Error('Borrow request not found');
    const strategy = isPremiumUser ? new PremiumUserFineStrategy() : new DefaultFineStrategy();
    const overdueDays = calcOverdueDays(request.dueDate);
    const amount = strategy.calculate(overdueDays);
    if (amount <= 0) return null;
    return fineRepository.create({ user: request.user._id, borrowRequest: requestId, amount });
  }

  async markFinePaid(fineId) {
    return fineRepository.update(fineId, { status: 'PAID', paidAt: new Date() });
  }

  async getPendingFines(userId) {
    return fineRepository.findPendingByUser(userId);
  }
}
