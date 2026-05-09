import { Router } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import { successResponse } from '../../shared/utils/apiResponse.js';
import { releaseExpiredSeatLocks } from './lockCleanup.service.js';

const router = Router();

router.post('/release-expired-locks', asyncHandler(async (req, res) => {
  const count = await releaseExpiredSeatLocks();
  return successResponse(res, { released: count });
}));

export default router;
