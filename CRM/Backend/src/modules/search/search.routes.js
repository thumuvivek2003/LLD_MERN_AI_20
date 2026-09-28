import { Router } from 'express';
import { searchController } from './search.controller.js';
import { requirePermission } from '../permission/permission.middleware.js';

const router = Router();

router.post('/', requirePermission('read', (req) => req.body?.objectId), searchController.search);
router.get('/suggest', requirePermission('read', (req) => req.query.objectId), searchController.suggest);

export default router;
