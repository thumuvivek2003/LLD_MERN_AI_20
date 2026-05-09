import { BorrowService } from '../services/BorrowService.js';

const borrowService = new BorrowService();

export class BorrowController {
  async requestBorrow(req, res, next) {
    try {
      const request = await borrowService.requestBorrow(req.user.id, req.body.bookId);
      res.status(201).json({ success: true, data: request });
    } catch (err) {
      next(err);
    }
  }

  async approveRequest(req, res, next) {
    try {
      const request = await borrowService.approveRequest(req.params.id);
      res.json({ success: true, data: request });
    } catch (err) {
      next(err);
    }
  }

  async rejectRequest(req, res, next) {
    try {
      const request = await borrowService.rejectRequest(req.params.id);
      res.json({ success: true, data: request });
    } catch (err) {
      next(err);
    }
  }

  async returnBook(req, res, next) {
    try {
      const request = await borrowService.returnBook(req.params.id);
      res.json({ success: true, data: request });
    } catch (err) {
      next(err);
    }
  }

  async getBorrowHistory(req, res, next) {
    try {
      const history = await borrowService.getUserBorrowHistory(
        req.params.userId || req.user.id
      );
      res.json({ success: true, data: history });
    } catch (err) {
      next(err);
    }
  }
}
