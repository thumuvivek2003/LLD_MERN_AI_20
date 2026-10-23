import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createLotValidator, createSlotValidator } from '../validators/parking.validator.js';
import { UserRole } from '../enums/UserRole.js';

export const adminRoutes = (controller) => {
  const router = Router();
  router.use(authMiddleware, requireRole(UserRole.ADMIN));
  router.post('/lots', validate(createLotValidator), controller.createLot);
  router.post('/slots', validate(createSlotValidator), controller.addSlot);
  router.patch('/slots/:slotId/maintenance', controller.setMaintenance);
  return router;
};
