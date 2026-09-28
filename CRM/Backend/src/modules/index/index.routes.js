import { Router } from 'express';
import { indexController } from './index.controller.js';
import { requireMetadataAdmin } from '../permission/permission.middleware.js';

const router = Router();

router.get('/', indexController.list);
router.get('/summary', indexController.summary);
router.post('/', requireMetadataAdmin('update'), indexController.create);
router.post('/rebuild-all', requireMetadataAdmin('update'), indexController.rebuildAll);
router.get('/:indexId', indexController.get);
router.post('/:indexId/rebuild', requireMetadataAdmin('update'), indexController.rebuild);
router.delete('/:indexId', requireMetadataAdmin('delete'), indexController.remove);

export default router;
