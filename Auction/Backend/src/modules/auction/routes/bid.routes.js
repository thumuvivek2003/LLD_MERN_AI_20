import { Router } from 'express';
import { auctionController } from '../controllers/auction.controller.js';
import { authenticate } from '../../../shared/middleware/auth.middleware.js';
import { authorizeRoles } from '../../../shared/middleware/role.middleware.js';
import { ROLES } from '../../../shared/constants/roles.constant.js';

// mergeParams so /:id is available here
const router = Router({ mergeParams: true });

router.get('/', auctionController.getBids);
router.post('/', authenticate, authorizeRoles(ROLES.MEMBER), auctionController.placeBid);

export default router;
