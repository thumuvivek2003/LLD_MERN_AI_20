import { Router } from 'express';
import { fieldController } from './field.controller.js';
import { requirePermission, requireMetadataAdmin } from '../permission/permission.middleware.js';

/** Mounted at /objects/:oid/fields — mergeParams keeps `:oid` visible. */
const router = Router({ mergeParams: true });

router.get('/', requirePermission('read'), fieldController.list);
router.post('/', requireMetadataAdmin('update'), fieldController.add);
router.put('/reorder', requireMetadataAdmin('update'), fieldController.reorder);
router.patch('/:fid', requireMetadataAdmin('update'), fieldController.patch);
router.delete('/:fid', requireMetadataAdmin('update'), fieldController.remove);

export default router;
