import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

router.post('/', authenticate, authorize(['admin']), userController.createUser);
router.get('/', authenticate, authorize(['admin', 'librarian']), userController.getUsers);
router.get('/:id', authenticate, userController.getUser);
router.put('/:id', authenticate, userController.updateUser);
router.delete('/:id', authenticate, authorize(['admin']), userController.deleteUser);

export default router;