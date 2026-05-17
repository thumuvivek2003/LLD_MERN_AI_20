import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import * as controller from './user.controller.js';

export function registerUserRoutes() {
  const router = Router();
  router.use(authenticate);
  router.get('/me', controller.getMyProfile);
  router.patch(
    '/me',
    validate([body('name').isString().trim().notEmpty().withMessage('name is required')]),
    controller.updateMyProfile
  );
  router.get('/', controller.getUsers);
  router.get(
    '/:id',
    validate([param('id').isMongoId().withMessage('invalid user id')]),
    controller.getUserById
  );
  return router;
}
