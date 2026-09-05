// modules/friendship/friendship.routes.js
import { Router } from 'express';
import { friendshipService } from './friendship.service.js';
import { attachCurrentUser } from '../../core/middleware/request.middleware.js';

export function registerFriendshipRoutes() {
  const router = Router();
  router.use(attachCurrentUser());
  // GET /api/friends → current user's friends
  router.get('/', async (req, res, next) => {
    try {
      res.json(await friendshipService.getFriends(req.currentUserId));
    } catch (err) {
      next(err);
    }
  });
  return router;
}
