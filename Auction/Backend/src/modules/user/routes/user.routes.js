import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { authenticate } from '../../../shared/middleware/auth.middleware.js';
import { authorizeRoles } from '../../../shared/middleware/role.middleware.js';
import { ROLES } from '../../../shared/constants/roles.constant.js';

const router = Router();

router.get('/', authenticate, authorizeRoles(ROLES.ADMIN), userController.getUsers);
router.get('/members', authenticate, authorizeRoles(ROLES.ADMIN), userController.getMembers);

export default router;
