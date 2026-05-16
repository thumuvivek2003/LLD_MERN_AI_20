import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller.js';

export function registerNotificationRoutes() {
  const router = Router();

  router.post('/trigger', notificationController.triggerNotification);
  router.post('/send', notificationController.sendNotification);
  router.post('/send-group', notificationController.sendGroupNotification);
  router.get('/user/:userId', notificationController.getUserInbox);
  router.get('/', notificationController.getNotifications);
  router.get('/:id', notificationController.getNotificationById);
  router.post('/:id/retry', notificationController.retryNotification);

  return router;
}
