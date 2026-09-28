import { Router } from 'express';
import { objectController } from './object.controller.js';
import fieldRoutes from '../field/field.routes.js';
import recordRoutes from '../record/record.routes.js';
import { requirePermission, requireMetadataAdmin } from '../permission/permission.middleware.js';

const router = Router();

router.get('/', objectController.list);
router.post('/', requireMetadataAdmin('create'), objectController.create);

router.get('/:oid', requirePermission('read'), objectController.get);
router.patch('/:oid', requireMetadataAdmin('update'), objectController.patch);
router.delete('/:oid', requireMetadataAdmin('delete'), objectController.remove);

router.post('/:oid/publish', requireMetadataAdmin('update'), objectController.publish);
router.post('/:oid/archive', requireMetadataAdmin('update'), objectController.archive);
router.post('/:oid/restore', requireMetadataAdmin('update'), objectController.restore);
router.post('/:oid/clone', requireMetadataAdmin('create'), objectController.clone);

router.get('/:oid/versions', requirePermission('read'), objectController.versions);
router.get('/:oid/stats', requirePermission('read'), objectController.stats);
router.get('/:oid/references', requirePermission('read'), objectController.referencedBy);

router.use('/:oid/fields', fieldRoutes);
router.use('/:oid/records', recordRoutes);

export default router;
