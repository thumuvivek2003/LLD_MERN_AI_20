// modules/view/view.routes.js — registerViewRoutes()
// Mounted under /api/status so the public contract is POST /status/:statusId/view.
import { Router } from 'express';
import { viewController } from './view.controller.js';
import { attachCurrentUser } from '../../core/middleware/request.middleware.js';

export function registerViewRoutes() {
  const router = Router();
  router.use(attachCurrentUser());
  router.post('/:statusId/view', viewController.markViewed);
  return router;
}
