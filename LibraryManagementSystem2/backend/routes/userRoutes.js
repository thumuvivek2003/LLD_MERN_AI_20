import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { UserRole } from '../enums/UserRole.js';

const router = Router();
const userController = new UserController();

router.post('/', authMiddleware, roleMiddleware(UserRole.ADMIN), (req, res, next) => userController.addUser(req, res, next));
router.put('/:id/activate', authMiddleware, roleMiddleware(UserRole.ADMIN), (req, res, next) => userController.activateUser(req, res, next));
router.put('/:id/deactivate', authMiddleware, roleMiddleware(UserRole.ADMIN), (req, res, next) => userController.deactivateUser(req, res, next));
router.put('/:id/role', authMiddleware, roleMiddleware(UserRole.ADMIN), (req, res, next) => userController.assignRole(req, res, next));

export default router;
