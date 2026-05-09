const ApiError = require('../../utils/ApiError');
const fineRepository = require('./fine.repository');
const { FINE_STATUS } = require('../../models/Fine');

class FineService {
  async getUserFines(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [fines, total] = await Promise.all([
      fineRepository.findByUser(userId, skip, Number(limit)),
      fineRepository.countByUser(userId),
    ]);
    const pending = await fineRepository.findPendingByUser(userId);
    const pendingTotal = pending.reduce((sum, f) => sum + f.amount, 0);
    return { fines, total, page: Number(page), pages: Math.ceil(total / limit), pendingTotal };
  }

  async payFine(fineId, userId, isAdmin = false) {
    const fine = await fineRepository.findById(fineId);
    if (!fine) throw new ApiError(404, 'Fine not found.');

    if (!isAdmin && fine.userId._id.toString() !== userId.toString()) {
      throw new ApiError(403, 'Not authorized to pay this fine.');
    }

    if (fine.status === FINE_STATUS.PAID) {
      throw new ApiError(400, 'Fine already paid.');
    }

    return fineRepository.updateById(fineId, {
      status: FINE_STATUS.PAID,
      paidDate: new Date(),
    });
  }

  async getAllFines(page = 1, limit = 20, status) {
    const filter = status ? { status } : {};
    const skip = (page - 1) * limit;
    const [fines, total] = await Promise.all([
      fineRepository.findAll(filter, skip, Number(limit)),
      fineRepository.countAll(filter),
    ]);
    return { fines, total, page: Number(page), pages: Math.ceil(total / limit) };
  }
}

module.exports = new FineService();
