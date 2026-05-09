import { Router } from 'express';
import { FineController } from '../controllers/FineController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { UserRole } from '../enums/UserRole.js';

const router = Router();
const fineController = new FineController();

router.get('/pending', authMiddleware, (req, res, next) => fineController.getPendingFines(req, res, next));
router.put('/:id/pay', authMiddleware, (req, res, next) => fineController.markFinePaid(req, res, next));
router.post('/calculate/:requestId', authMiddleware, roleMiddleware(UserRole.ADMIN), (req, res, next) => fineController.calculateFine(req, res, next));

export default router;
