import { Router } from 'express';
import { recordController } from './record.controller.js';
import { requirePermission } from '../permission/permission.middleware.js';

/** Mounted at /objects/:oid/records. Static paths must precede `/:rid`. */
const router = Router({ mergeParams: true });

router.get('/', requirePermission('read'), recordController.list);
router.post('/', requirePermission('create'), recordController.create);

router.post('/bulk', requirePermission('update'), recordController.bulk);
router.post('/import', requirePermission('create'), recordController.import);
router.get('/import/sample', requirePermission('read'), recordController.importSample);
router.get('/export', requirePermission('read'), recordController.export);

router.get('/:rid', requirePermission('read'), recordController.get);
router.patch('/:rid', requirePermission('update'), recordController.patch);
router.post('/:rid/archive', requirePermission('delete'), recordController.archive);
router.post('/:rid/restore', requirePermission('update'), recordController.restore);
router.get('/:rid/related', requirePermission('read'), recordController.related);
router.get('/:rid/history', requirePermission('read'), recordController.history);

export default router;
