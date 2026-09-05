// modules/status/status.routes.js — registerStatusRoutes()
// Public contract (all under /api/status, all require x-user-id):
//   POST   /                    create a text status
//   GET    /feed                grouped home feed
//   GET    /me                  my own active statuses
//   GET    /:userId             one friend's statuses (drill-down)
//   POST   /:statusId/view      record a view (idempotent)
//   GET    /:statusId/viewers   viewers of my status (owner only)
//   DELETE /:statusId           delete my status
import { Router } from 'express';
import { statusController } from './status.controller.js';
import { attachCurrentUser } from '../../core/middleware/request.middleware.js';
import { registerViewRoutes } from '../view/view.routes.js';

export function registerStatusRoutes() {
  const router = Router();
  router.use(attachCurrentUser());

  router.post('/', statusController.createStatus);
  router.get('/feed', statusController.getFeed);
  router.get('/me', statusController.getMyStatuses);

  // View recording lives in the view module but shares the /status prefix.
  router.use('/', registerViewRoutes());

  router.get('/:statusId/viewers', statusController.getViewers);
  router.delete('/:statusId', statusController.deleteStatus);
  // Keep the generic :userId LAST so it doesn't shadow /feed, /me, etc.
  router.get('/:userId', statusController.getUserStatuses);

  return router;
}
