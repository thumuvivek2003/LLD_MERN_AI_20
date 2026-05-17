import { Router } from 'express';
import { verifyAuth } from '../../common/middlewares/auth.middleware.js';
import { getProfile } from './user.controller.js';

const router = Router();

router.get('/me', verifyAuth, getProfile);

export default router;
