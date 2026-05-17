import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { authenticate, requireAdmin } from '../middleware/admin.middleware.js';

export function registerAdminRoutes() {
  const router = Router();
  router.use(authenticate, requireAdmin);

  router.get('/dashboard', adminController.getDashboard);
  router.get('/strategies', adminController.listStrategies);
  router.put('/strategy', adminController.updateStrategy);
  router.get('/config', adminController.getConfig);
  router.put('/config', adminController.updateLimitConfig);
  router.get('/clients', adminController.getAllClientStats);
  router.get('/clients/:clientId', adminController.getClientDetails);
  router.post('/clients', adminController.createClient);
  router.post('/clients/:clientId/reset', adminController.resetClientCounters);
  router.post('/clients/:clientId/block', adminController.blockClient);
  router.post('/clients/:clientId/unblock', adminController.unblockClient);

  return router;
}
