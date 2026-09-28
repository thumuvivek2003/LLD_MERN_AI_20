import { Router } from 'express';
import { lookupController } from './lookup.controller.js';
import { requirePermission } from '../permission/permission.middleware.js';

const router = Router();

router.get('/options', requirePermission('read', (req) => req.query.objectId), lookupController.options);
router.get('/graph', lookupController.graph);
router.get('/stats', lookupController.stats);

export default router;
