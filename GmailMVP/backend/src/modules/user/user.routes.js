import { Router } from 'express';
import * as userController from './user.controller.js';

const router = Router();

// GET /api/users
router.get('/', userController.getUsers);
// GET /api/users/:id
router.get('/:id', userController.getUser);

export default router;
