import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import * as controller from './message.controller.js';

export function registerMessageRoutes() {
  const router = Router();
  router.use(authenticate);

  router.post(
    '/',
    validate([
      body('chatId').isMongoId().withMessage('chatId required'),
      body('content').isString().trim().notEmpty().withMessage('content required'),
      body('tempId').optional().isString(),
    ]),
    controller.sendMessage
  );

  router.get(
    '/:chatId',
    validate([param('chatId').isMongoId().withMessage('invalid chatId')]),
    controller.getMessages
  );

  router.patch(
    '/:messageId/read',
    validate([param('messageId').isMongoId().withMessage('invalid messageId')]),
    controller.markMessageRead
  );

  router.patch(
    '/:chatId/read-all',
    validate([param('chatId').isMongoId().withMessage('invalid chatId')]),
    controller.markChatReadAll
  );

  return router;
}
