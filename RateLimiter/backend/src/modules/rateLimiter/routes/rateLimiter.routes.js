import { Router } from 'express';
import { rateLimiterController } from '../controllers/rateLimiter.controller.js';
import { authenticate } from '../middleware/admin.middleware.js';
import { validateApiKey } from '../middleware/apiKey.middleware.js';

export function registerRateLimiterRoutes() {
  const router = Router();
  router.post('/request', validateApiKey, rateLimiterController.allowRequest);
  router.get('/usage', authenticate, rateLimiterController.getClientUsage);
  router.get('/strategy/current', rateLimiterController.getCurrentStrategy);
  return router;
}
