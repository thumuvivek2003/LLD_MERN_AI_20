import { Router } from 'express';

export const parkingRoutes = (controller) => {
  const router = Router();
  router.get('/', controller.list);
  router.get('/:id', controller.get);
  return router;
};
