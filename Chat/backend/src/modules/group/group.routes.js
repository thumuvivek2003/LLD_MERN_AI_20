import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import * as controller from './group.controller.js';

export function registerGroupRoutes() {
  const router = Router();
  router.use(authenticate);

  router.post(
    '/:chatId/members',
    validate([
      param('chatId').isMongoId(),
      body('memberIds').isArray({ min: 1 }).withMessage('memberIds must be a non-empty array'),
      body('memberIds.*').isMongoId().withMessage('each memberId must be valid'),
    ]),
    controller.addMembers
  );

  router.delete(
    '/:chatId/members/:userId',
    validate([param('chatId').isMongoId(), param('userId').isMongoId()]),
    controller.removeMember
  );

  router.patch(
    '/:chatId',
    validate([
      param('chatId').isMongoId(),
      body('name').isString().trim().notEmpty().withMessage('name is required'),
    ]),
    controller.renameGroup
  );

  return router;
}
