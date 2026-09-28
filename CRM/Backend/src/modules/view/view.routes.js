import { Router } from 'express';
import { viewController } from './view.controller.js';

const router = Router();

router.get('/', viewController.list);
router.post('/', viewController.create);
router.patch('/:viewId', viewController.patch);
router.delete('/:viewId', viewController.remove);

export default router;
