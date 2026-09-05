// modules/user/user.routes.js — registerUserRoutes()
import { Router } from 'express';
import { userController } from './user.controller.js';

export function registerUserRoutes() {
  const router = Router();
  router.get('/', userController.list); // GET /api/users
  router.post('/:userId/login', userController.login); // POST /api/users/:userId/login
  return router;
}
