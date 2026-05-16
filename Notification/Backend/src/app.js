import express from 'express';
import cors from 'cors';
import { loadAppConfig } from './config/app.config.js';
import { actorContext } from './shared/middleware/actor.middleware.js';
import { logRequest } from './shared/middleware/requestLogger.middleware.js';
import { handleError, notFoundHandler } from './shared/middleware/error.middleware.js';
import { ok } from './shared/utils/response.util.js';

import { registerNotificationRoutes } from './modules/notification/routes/notification.routes.js';
import { registerTemplateRoutes } from './modules/template/routes/template.routes.js';
import { registerUserRoutes } from './modules/user/routes/user.routes.js';
import { registerAdminRoutes } from './modules/admin/routes/admin.routes.js';
import { registerSystemRoutes } from './modules/system/routes/system.routes.js';

export function createExpressApp() {
  const config = loadAppConfig();
  const app = express();

  app.use(
    cors({
      origin: config.clientOrigin,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(actorContext);
  app.use(logRequest);

  app.get('/health', (_req, res) => ok(res, { ok: true, ts: new Date().toISOString() }));

  app.use('/api/notifications', registerNotificationRoutes());
  app.use('/api/templates', registerTemplateRoutes());
  app.use('/api/users', registerUserRoutes());
  app.use('/api/admin', registerAdminRoutes());
  app.use('/api/system', registerSystemRoutes());

  app.use(notFoundHandler);
  app.use(handleError);

  return app;
}
