import { Router } from 'express';
import { systemController } from './system.controller.js';
import { requireMetadataAdmin } from '../permission/permission.middleware.js';

const router = Router();

router.get('/health', systemController.health);
router.get('/metrics', systemController.metrics);
router.get('/overview', systemController.overview);

router.get('/events', systemController.events);
router.get('/events/types', systemController.eventTypes);

router.get('/jobs', systemController.jobs);
router.post('/jobs/:jobId/run', requireMetadataAdmin('update'), systemController.runJob);

router.get('/cache', systemController.cache);
router.post('/cache/refresh', requireMetadataAdmin('update'), systemController.refreshCache);
router.delete('/cache', requireMetadataAdmin('update'), systemController.clearCache);

router.get('/validation/stats', systemController.validationStats);
router.get('/index/stats', systemController.indexStats);

router.get('/logs', systemController.logs);
router.get('/logs/summary', systemController.logSummary);

router.get('/alerts', systemController.alerts);
router.post('/alerts/:alertId/ack', systemController.ackAlert);

router.get('/storage', systemController.storage);
router.get('/settings', systemController.settings);
router.patch('/settings', requireMetadataAdmin('update'), systemController.patchSettings);

export default router;
