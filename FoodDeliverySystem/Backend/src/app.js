import express from 'express';
import cors from 'cors';
import { registerAllRoutes } from './routes/index.js';
import { globalErrorHandler } from './core/middlewares/error.middleware.js';

export const createExpressApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  registerAllRoutes(app);

  app.use((req, res) => res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` }));
  app.use(globalErrorHandler);
  return app;
};
