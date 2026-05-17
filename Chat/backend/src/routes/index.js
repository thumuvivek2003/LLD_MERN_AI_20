import { Router } from 'express';
import { API_PREFIX } from '../shared/constants/app.constant.js';
import { registerAuthRoutes } from '../modules/auth/auth.routes.js';
import { registerUserRoutes } from '../modules/user/user.routes.js';
import { registerChatRoutes } from '../modules/chat/chat.routes.js';
import { registerGroupRoutes } from '../modules/group/group.routes.js';
import { registerMessageRoutes } from '../modules/message/message.routes.js';
import { registerAdminRoutes } from '../modules/admin/admin.routes.js';

/**
 * Mounts all module routers under /api.
 */
export function registerRoutes(app) {
  const root = Router();
  root.get('/health', (_req, res) => res.json({ success: true, data: { ok: true } }));
  root.use('/auth', registerAuthRoutes());
  root.use('/users', registerUserRoutes());
  root.use('/chats', registerChatRoutes());
  root.use('/groups', registerGroupRoutes());
  root.use('/messages', registerMessageRoutes());
  root.use('/admin', registerAdminRoutes());
  app.use(API_PREFIX, root);
}
