import { FineService } from '../services/FineService.js';

const fineService = new FineService();

export class FineController {
  async getPendingFines(req, res, next) {
    try {
      const fines = await fineService.getPendingFines(req.user.id);
      res.json({ success: true, data: fines });
    } catch (err) {
      next(err);
    }
  }

  async markFinePaid(req, res, next) {
    try {
      const fine = await fineService.markFinePaid(req.params.id);
      res.json({ success: true, data: fine });
    } catch (err) {
      next(err);
    }
  }

  async calculateFine(req, res, next) {
    try {
      const fine = await fineService.calculateFine(req.params.requestId, req.body.isPremium);
      res.json({ success: true, data: fine });
    } catch (err) {
      next(err);
    }
  }
}
