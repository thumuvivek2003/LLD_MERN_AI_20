import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { buildCorsOptions } from './config/cors.config.js';
import { registerRoutes } from './routes/index.js';
import { handleError } from './middleware/error.middleware.js';
import { errorResponse } from './shared/utils/response.util.js';
import { ERROR_CODES, HTTP_STATUS } from './shared/constants/errors.constant.js';
import { registerSubscribers } from './events/subscribers/index.js';

/**
 * Build and configure the Express application. The HTTP server and
 * Socket.IO attachment happen in server.js so this function is easy
 * to test in isolation.
 */
export function bootstrapApp() {
  const app = express();
  // app.use(cors(buildCorsOptions())); if we allow only some ports 
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('dev'));

  registerSubscribers();
  registerRoutes(app);

  // 404 catch-all
  app.use((_req, res) => {
    return errorResponse(res, ERROR_CODES.NOT_FOUND, 'Route not found', HTTP_STATUS.NOT_FOUND);
  });

  app.use(handleError);
  return app;
}

export default bootstrapApp;
