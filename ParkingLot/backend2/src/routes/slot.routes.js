import { Router } from 'express';

export const slotRoutes = (controller) => {
  const router = Router();
  router.get('/lot/:lotId', controller.listByLot);
  return router;
};
