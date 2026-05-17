import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import * as controller from './chat.controller.js';

export function registerChatRoutes() {
  const router = Router();
  router.use(authenticate);

  router.get('/', controller.getChats);

  router.post(
    '/direct',
    validate([body('userId').isMongoId().withMessage('userId must be a valid id')]),
    controller.createDirectChat
  );

  router.post(
    '/group',
    validate([
      body('name').isString().trim().notEmpty().withMessage('name is required'),
      body('memberIds').isArray().withMessage('memberIds must be an array'),
      body('memberIds.*').isMongoId().withMessage('each memberId must be valid'),
    ]),
    controller.createGroupChat
  );

  router.get(
    '/:chatId',
    validate([param('chatId').isMongoId().withMessage('invalid chatId')]),
    controller.getChatById
  );

  return router;
}
