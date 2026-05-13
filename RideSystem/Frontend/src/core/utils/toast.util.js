import { notificationService } from '../services/notification.service.js';
export const toast = {
  success: (title, body) => notificationService.push({ title, body, tone: 'success' }),
  info: (title, body) => notificationService.push({ title, body, tone: 'info' }),
  error: (title, body) => notificationService.push({ title, body, tone: 'danger' }),
};
