import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';

export function registerAdminRoutes() {
  const router = Router();
  router.get('/dashboard', adminController.getDashboard);
  router.get('/stats', adminController.getSystemStats);
  router.post('/retry-failed', adminController.retryFailedNotifications);
  return router;
}
