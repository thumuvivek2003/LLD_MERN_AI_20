import { Router } from 'express';
import { auctionController } from '../controllers/auction.controller.js';
import { authenticate } from '../../../shared/middleware/auth.middleware.js';
import { authorizeRoles } from '../../../shared/middleware/role.middleware.js';
import { ROLES } from '../../../shared/constants/roles.constant.js';
import bidRoutes from './bid.routes.js';

const router = Router();

router.get('/live', auctionController.getLiveAuctions);
router.get('/me/bids', authenticate, authorizeRoles(ROLES.MEMBER), auctionController.myBids);
router.get('/me/wins', authenticate, authorizeRoles(ROLES.MEMBER), auctionController.myWins);

router.get('/', auctionController.list);
router.post('/', authenticate, authorizeRoles(ROLES.ADMIN), auctionController.createAuction);

router.get('/:id', auctionController.getAuctionById);
router.post('/:id/close', authenticate, authorizeRoles(ROLES.ADMIN), auctionController.closeAuction);
router.post('/:id/assign', authenticate, authorizeRoles(ROLES.ADMIN), auctionController.assignBidders);

// nested bid endpoints
router.use('/:id/bids', bidRoutes);

export default router;
