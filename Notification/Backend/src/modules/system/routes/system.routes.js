import { Router } from 'express';
import { systemController } from '../controllers/system.controller.js';

export function registerSystemRoutes() {
  const router = Router();
  router.get('/queue', systemController.getQueue);
  router.get('/retry-queue', systemController.getRetryQueue);
  router.get('/logs', systemController.getLogs);
  return router;
}
