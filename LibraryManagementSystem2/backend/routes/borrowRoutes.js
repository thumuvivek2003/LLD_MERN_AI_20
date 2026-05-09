import { Router } from 'express';
import { BorrowController } from '../controllers/BorrowController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { UserRole } from '../enums/UserRole.js';

const router = Router();
const borrowController = new BorrowController();

router.post('/request', authMiddleware, (req, res, next) => borrowController.requestBorrow(req, res, next));
router.put('/:id/approve', authMiddleware, roleMiddleware(UserRole.ADMIN), (req, res, next) => borrowController.approveRequest(req, res, next));
router.put('/:id/reject', authMiddleware, roleMiddleware(UserRole.ADMIN), (req, res, next) => borrowController.rejectRequest(req, res, next));
router.put('/:id/return', authMiddleware, (req, res, next) => borrowController.returnBook(req, res, next));
router.get('/history/:userId', authMiddleware, (req, res, next) => borrowController.getBorrowHistory(req, res, next));

export default router;
