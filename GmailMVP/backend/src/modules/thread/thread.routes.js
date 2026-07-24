import { Router } from 'express';
import * as threadController from './thread.controller.js';

const router = Router();

// GET /api/threads/:id
router.get('/:id', threadController.getThread);

export default router;
