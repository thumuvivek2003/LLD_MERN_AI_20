import { Router } from 'express';
import { userController } from './user.controller.js';
import { requireMetadataAdmin } from '../permission/permission.middleware.js';

const router = Router();

router.get('/', userController.list);
router.patch('/:userId', requireMetadataAdmin('update'), userController.assignRole);

export default router;
