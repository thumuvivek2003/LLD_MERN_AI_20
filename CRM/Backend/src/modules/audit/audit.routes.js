import { Router } from 'express';
import { auditController } from './audit.controller.js';

const router = Router();

router.get('/', auditController.query);
router.get('/recent', auditController.recent);

export default router;
